import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
} from "@heroui/react";
import { CircleUser } from "lucide-react";
import { useRef } from "react";

export default function ProfileForm({
  formData,
  setFormData,
  onSave,
  onCancel,
  onDelete,
  isSaving,
  isFormUnchanged,
  onImageUpload,
  signedImageUrl,
  handleDeleteImage,
}) {
  const fileInput = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Frontend validation
    if (
      !["image/jpg", "image/jpeg", "image/png"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      alert("Only JPEG/PNG images under 2MB are allowed.");
      return;
    }

    // Upload to backend
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("email", formData.email);
    let res = null;
    try {
      res = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formDataObj,
      });
    } catch (error) {
      console.log(error);
    }

    if (res.ok) {
      const { url } = await res.json();
      onImageUpload(url);
    } else {
      alert("Image upload failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Profile</h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-col items-center">
            {signedImageUrl ? (
              <img
                src={signedImageUrl}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <CircleUser className="w-24 h-24 text-gray-400 mb-2" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div className="flex flex-row space-x-3 mt-2">
              <Button color="primary" onPress={() => fileInput.current.click()}>
                Upload/Replace
              </Button>
              <Button color="danger" onPress={handleDeleteImage} isDisabled={!formData.profileImageUrl || isSaving}
              >
                Delete Image
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="w-full text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
              disabled={isSaving}
            />
          </div>
        </CardBody>
        <CardFooter className="flex flex-row justify-between space-x-3">
          <div className="flex flex-row space-x-2">
            <Button
              color="primary"
              onPress={onSave}
              isDisabled={isSaving || isFormUnchanged}
            >
              Save
            </Button>
            <Button
              color="secondary"
              onPress={onCancel}
              isDisabled={isSaving || isFormUnchanged}
            >
              Cancel
            </Button>
          </div>
          <Button color="danger" onPress={onDelete} isDisabled={isSaving}>
            Delete Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
