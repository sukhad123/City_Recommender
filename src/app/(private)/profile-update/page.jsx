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
import SuccessModal from "./_components/SuccessModal";
import SuccessModalReload from "./_components/SuccessModalReload";
import ErrorModal from "./_components/ErrorModal";
import ConfirmModal from "./_components/ConfirmModal";

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

  const [successOpen, setSuccessOpen] = useState(false);
  const [successReloadOpen, setSuccessReloadOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [onConfirmDelete, setOnConfirmDelete] = useState(null);

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
      setModalMsg("Name updated successfully!");
      setSuccessOpen(true);
    } catch (error) {
      setModalMsg("Failed to update Name in Cognito.");
      setErrorOpen(true);
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (url) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));

    try {
      await updateProfileImageByEmail(user.email, url);
      setOriginalData((prev) => ({ ...prev, profileImageUrl: url }));
      setModalMsg("Profile picture updated!");
      setSuccessReloadOpen(true);
    } catch (error) {
      setModalMsg("Failed to update profile picture in database.");
      setErrorOpen(true);
    }
    await fetchSignedImageUrl(url);
  };

  // Cancel handler: revert UI state
  const handleCancel = () => {
    setFormData({ ...originalData });
    setModalMsg("Edit cancelled.");
    setSuccessOpen(true);
  };

  const handleDelete = async () => {
    setModalMsg(
      "Are you sure you want to delete your profile? This cannot be undone."
    );
    setConfirmOpen(true);
    setOnConfirmDelete(() => async () => {
      setIsSaving(true);
      try {
        const client = new CognitoIdentityProviderClient({
          region: COGNITO_REGION,
        });
        const command = new DeleteUserCommand({
          AccessToken: user.accessToken,
        });
        await client.send(command);
        await deleteReviewsByEmail(user.email);
        await deleteUserByEmail(user.email);
        setConfirmOpen(false);
        setModalMsg("Profile deleted.");
        setSuccessOpen(true);
        setTimeout(() => router.push("/"), 1000); // Redirect after success message/modal
      } catch (error) {
        setConfirmOpen(false);
        setModalMsg("Failed to delete profile from Cognito.");
        setErrorOpen(true);
      }
      setIsSaving(false);
    });
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
        setModalMsg("Profile image deleted.");
        setSuccessReloadOpen(true);
      } else {
        setModalMsg("Failed to delete image.");
        setErrorOpen(true);
      }
    } catch (error) {
      setModalMsg("Failed to delete image.");
      setErrorOpen(true);
    }
    setIsSaving(false);
  };

  return (
    <>
      <ProfileForm
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
      <SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
        }}
        message={modalMsg}
      />
      <SuccessModalReload
        isOpen={successReloadOpen}
        onClose={() => {
          setSuccessReloadOpen(false);
          window.location.reload()
        }}
        message={modalMsg}
      />
      <ErrorModal
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={modalMsg}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        message={modalMsg}
        loading={isSaving}
      />
    </>
  );
}

export default ProfilePage;
