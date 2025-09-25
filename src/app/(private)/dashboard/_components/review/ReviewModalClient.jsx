"use client";
import { useState, useContext } from "react";
import { Button } from "@heroui/react";
import ReviewModal from "./ReviewModal";
import RejectModal from "./RejectModal";
import { useAuthInfo } from "../../../../auth/utils/getCurrentUserDetails";
export default function ReviewModalClient({ onReviewAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthInfo();
  const [rejectOpen, setRejectOpen] = useState(false);

  const handleSubmit = async ({ comment, city, rating }) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment,
          city,
          rating,
          userId: user.userName,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review");

      onReviewAdded?.();

      setIsOpen(false);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <>
      <Button
        color="primary"
        onPress={() => {
          setIsOpen(true);
        }}
      >
        Write a Review
      </Button>
      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
      <RejectModal isOpen={rejectOpen} onClose={() => setRejectOpen(false)} />
    </>
  );
}
