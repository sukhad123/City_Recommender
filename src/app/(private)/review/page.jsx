"use client";

import { useState } from "react";
import ReviewForm from "./_components/ReviewForm";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import ReviewList from "./_components/ReviewList";
import LoadingSpinner from "../../components/ui/spinner";
import { Button } from "@heroui/react";

export default function Review() {
  const user = useAuthInfo();
  const [showForm, setShowForm] = useState(false); 

  return (
    <>
      {user ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          {/* Show reviews */}
          <ReviewList email={user?.email} />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
