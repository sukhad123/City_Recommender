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
import { findUserByEmail, getUserNameByEmail, updateUserNameByEmail } from "../../../repositories/user";
import { useRouter } from "next/navigation";

const COGNITO_REGION = "us-east-2";

function ProfilePage() {
  const user = useAuthInfo();
  const [editName, setEditName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Initialize original and editable name after authentication
  useEffect(() => {
    async function fetchLatestUser() {
      // Fetch from DB using email, or from Cognito
      const latestName = await getUserNameByEmail(user.email);
      setOriginalName(latestName || "");
      setEditName(latestName || "");
    }
    if (user && user.email) {
      fetchLatestUser();
    }
  }, [user?.email]);

  if (!user) return <div>Loading...</div>;

  // Save handler: update Cognito "name" attribute & update in DB
  const handleSave = async (newName) => {
    setIsSaving(true);
    try {
      const client = new CognitoIdentityProviderClient({
        region: COGNITO_REGION,
      });
      const command = new UpdateUserAttributesCommand({
        AccessToken: user.accessToken,
        UserAttributes: [{ Name: "name", Value: newName }],
      });
      await client.send(command);
      setOriginalName(newName);
      setEditName(newName);
      updateUserNameByEmail(user.email, newName);
      user.name = newName;
      alert("Name updated successfully!");
    } catch (error) {
      alert("Failed to update Name in Cognito.");
    }
    setIsSaving(false);
  };

  // Cancel handler: revert UI state
  const handleCancel = () => {
    setEditName(originalName);
    alert("Edit cancelled.");
    router.push("/dashboard");
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
      email={user.email}
      name={originalName}
      editName={editName}
      setEditName={setEditName}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      isSaving={isSaving}
    />
  );
}

export default ProfilePage;
