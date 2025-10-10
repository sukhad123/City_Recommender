// ProfilePage.js
"use client";
import { useState, useEffect } from "react";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import ProfileForm from "./_components/profileUpdateForm";
import {
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
  DeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  getUserNameByEmail,
  updateUserNameByEmail,
} from "../../../repositories/user";

const COGNITO_REGION = "us-east-2";

function ProfilePage() {
  const user = useAuthInfo();
  const [originalData, setOriginalData] = useState({ name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchLatestUser() {
      // Fetch user details from DB
      const latestName = await getUserNameByEmail(user.email);
      setOriginalData({ name: latestName || "", email: user.email });
      setFormData({ name: latestName || "", email: user.email });
    }
    if (user && user.email) {
      fetchLatestUser();
    }
  }, [user?.email]);

  if (!user) return <div>Loading...</div>;

  const isFormUnchanged = Object.keys(originalData).every(
    key => originalData[key] === formData[key]
  );

  // Save handler: update Cognito "name" attribute & update in DB
  const handleSave = async (newName) => {
    setIsSaving(true);
    try {
      const client = new CognitoIdentityProviderClient({
        region: COGNITO_REGION,
      });
      const command = new UpdateUserAttributesCommand({
        AccessToken: user.accessToken,
        UserAttributes: [{ Name: "name", Value: formData.name }],
      });
      await client.send(command);
      await updateUserNameByEmail(user.email, formData.name);
      setOriginalData({ ...formData });
      alert("Name updated successfully!");
    } catch (error) {
      alert("Failed to update Name in Cognito.");
    }
    setIsSaving(false);
  };

  // Cancel handler: revert UI state
  const handleCancel = () => {
    setFormData({ ...originalData });
    alert("Edit cancelled.");
  };

  // Delete handler: remove Cognito user
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This cannot be undone."
      )
    ) {
      setIsSaving(true);
      try {
        const client = new CognitoIdentityProviderClient({
          region: COGNITO_REGION,
        });
        const command = new DeleteUserCommand({
          AccessToken: user.accessToken,
        });
        await client.send(command);
        alert("Profile deleted from Cognito.");
        // Optionally redirect or log out here
      } catch (error) {
        alert("Failed to delete profile from Cognito.");
      }
      setIsSaving(false);
    }
  };

  return (
    <ProfileForm
      formData={formData}
      setFormData={setFormData}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      isSaving={isSaving}
      isFormUnchanged={isFormUnchanged}
    />
  );
}

export default ProfilePage;
