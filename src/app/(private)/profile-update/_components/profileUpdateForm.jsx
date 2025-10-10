import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
} from "@heroui/react";

export default function ProfileForm({
  email,
  name,
  editName,
  setEditName,
  onSave,
  onCancel,
  onDelete,
  isSaving,
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Profile</h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              disabled
              className="w-full text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full"
              disabled={isSaving}
            />
          </div>
        </CardBody>
        <CardFooter className="flex flex-row justify-between space-x-3">
          <div className="flex flex-row space-x-2">
            <Button
              color="primary"
              onPress={() => onSave(editName)}
              isDisabled={isSaving}
            >
              Save
            </Button>
            <Button color="secondary" onPress={onCancel} isDisabled={isSaving}>
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
