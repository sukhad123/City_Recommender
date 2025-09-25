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
          <ReviewList />

          {/* Button to show form */}
          {!showForm && (
            <Button color="primary" onPress={() => setShowForm(true)}>
              Write a Review
            </Button>
          )}

          {/* Review form (visible only after button click) */}
          {showForm && (
            <div className="flex flex-col mt-4 w-full max-w-md">
              <ReviewForm
                email={user.email}
                onSubmit={() => setShowForm(false)} // ✅ auto-close after submit
              />
              <Button
                variant="light"
                className="mt-2"
                onPress={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
