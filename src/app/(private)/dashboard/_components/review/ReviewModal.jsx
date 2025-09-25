"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Textarea, Button, Select, SelectItem } from "@heroui/react";
import { Star } from "lucide-react";

const canadianCities = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Kitchener",
  "London",
  "Victoria",
  "Halifax",
  "Oshawa",
  "Windsor",
  "Saskatoon",
  "Regina",
  "St. John's",
  "Kelowna",
];

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment("");
      setCity("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!comment.trim() || !city || rating === 0) {
      setError("Please fill in all fields before submitting.");
      return;
    }
    setError("");
    onSubmit({ comment, city, rating });
    setComment("");
    setCity("");
    setRating(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Write a Review</ModalHeader>
            <ModalBody className="space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                fullWidth
                maxLength={200}
              />

              <Select
                placeholder="Select City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
              >
                {canadianCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </Select>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
