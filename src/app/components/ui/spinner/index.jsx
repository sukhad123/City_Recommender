import { Spinner } from "@heroui/react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label="Loading..."
        variant="default"
      />
    </div>
  );
}
