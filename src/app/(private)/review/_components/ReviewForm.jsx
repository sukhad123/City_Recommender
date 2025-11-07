"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";
import { createReview } from "../../../../repositories/review";

const canadianCities = [
  "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
  "Winnipeg", "Quebec_City", "Hamilton", "Kitchener", "London", "Victoria",
  "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St_Johns", "Kelowna"
];

export default function ReviewForm({ email }) {
  const [comment, setComment] = useState("");
  const [city, setCity] = useState("");

  const isSubmitDisabled = !comment.trim() || !city;

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
        <Select
          label="Select a City"
          placeholder="Choose..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          classNames={{
            listbox: "bg-gray-900 text-gray-100",
            popoverContent: "bg-gray-900 text-gray-100",
          }}
        >
          {canadianCities.map((c) => (
            <SelectItem key={c} value={c}>
              {c.replace("_", " ")}
            </SelectItem>
          ))}
        </Select>
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
