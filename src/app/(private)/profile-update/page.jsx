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
  deleteProfileImageByEmail,
  deleteUserByEmail,
  getUserByEmail,
  updateProfileImageByEmail,
  updateUserNameByEmail,
} from "../../../repositories/user";

import { useRouter } from "next/navigation";
import { deleteReviewsByEmail } from "../../../repositories/review";
import UserReviews from "./_components/UserReviews";

const COGNITO_REGION = "us-east-2";

function ProfilePage() {
  const user = useAuthInfo();
  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    profileImageUrl: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImageUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [signedImageUrl, setSignedImageUrl] = useState("");

  useEffect(() => {
    async function fetchLatestUser() {
      const latestUser = await getUserByEmail(user.email);
      setOriginalData({
        name: latestUser?.name || "",
        email: user.email,
        profileImageUrl: latestUser?.profileImageUrl || "",
      });
      setFormData({
        name: latestUser?.name || "",
        email: user.email,
        profileImageUrl: latestUser?.profileImageUrl || "",
      });
      if (latestUser?.profileImageUrl) {
        await fetchSignedImageUrl(latestUser.profileImageUrl);
      } else {
        setSignedImageUrl("");
      }
    }
    if (user && user.email) fetchLatestUser();
  }, [user?.email]);

  if (!user) return <div>Loading...</div>;

  const isFormUnchanged = Object.keys(originalData).every(
    (key) => originalData[key] === formData[key]
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
      await updateProfileImageByEmail(user.email, formData.profileImageUrl);
      setOriginalData({ ...formData });
      alert("Name updated successfully!");
    } catch (error) {
      alert("Failed to update Name in Cognito.");
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (url) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));

    try {
      await updateProfileImageByEmail(user.email, url);
      setOriginalData((prev) => ({ ...prev, profileImageUrl: url }));
      alert("Profile picture updated!");
    } catch (error) {
      alert("Failed to update profile picture in database.");
    }
    await fetchSignedImageUrl(url);
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
        deleteReviewsByEmail(user.email);
        deleteUserByEmail(user.email);
        alert("Profile deleted");
        router.push("/");
      } catch (error) {
        alert("Failed to delete profile from Cognito.");
      }
      setIsSaving(false);
    }
  };

  async function fetchSignedImageUrl(s3Key) {
    const res = await fetch(
      `/api/get-profile-image-url?key=${encodeURIComponent(s3Key)}`
    );
    if (res.ok) {
      const { url } = await res.json();
      setSignedImageUrl(url);
    }
  }

  const handleDeleteImage = async () => {
    if (!formData.profileImageUrl) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/delete-profile-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          s3Key: formData.profileImageUrl,
        }),
      });
      if (res.ok) {
        setFormData((prev) => ({ ...prev, profileImageUrl: "" }));
        setSignedImageUrl("");
        deleteProfileImageByEmail(formData.email);
        alert("Profile image deleted.");
      } else {
        alert("Failed to delete image.");
      }
    } catch (error) {
      alert("Failed to delete image.");
    }
    setIsSaving(false);
  };

  return (
    <><ProfileForm
      formData={formData}
      setFormData={setFormData}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      isSaving={isSaving}
      isFormUnchanged={isFormUnchanged}
      onImageUpload={handleImageUpload}
      signedImageUrl={signedImageUrl}
      handleDeleteImage={handleDeleteImage}
    />

    <UserReviews userEmail={user.email} />
    </>
  );
}

export default ProfilePage;