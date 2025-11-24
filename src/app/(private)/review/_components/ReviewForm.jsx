"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
} from "@heroui/react";
import { createReview } from "../../../../repositories/review";
import { CitySearch } from "../../../../utils/CitySearch";
import { cities } from "../../../../utils/cities"; // <-- Import cities for validation

export default function ReviewForm({ email }) {
  const [comment, setComment] = useState("");
  const [city, setCity] = useState("");

  const isValidCity = cities.includes(city);
  const isSubmitDisabled = !comment.trim() || !isValidCity;

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    await createReview(comment, city, email);
    setComment("");
    setCity("");
    window.location.reload();
  };

  return (
    <Card className="w-full">
      <CardBody className="space-y-4">
        <h2 className="text-xl font-bold">Write a Review</h2>
        <div>
          <label className="block mb-1">Select a City</label>
          <CitySearch
            value={city}
            onChange={setCity}
            disabled={false}
          />
        </div>
        <Input
          label="Your Comment"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          color={isSubmitDisabled ? "default" : "primary"}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          className={isSubmitDisabled ? "opacity-60 cursor-not-allowed" : ""}
        >
          Submit Review
        </Button>
      </CardBody>
    </Card>
  );
}
