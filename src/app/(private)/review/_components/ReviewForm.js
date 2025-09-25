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

const canadianCities = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec_City",
  "Hamilton",
  "Kitchener",
  "London",
  "Victoria",
  "Halifax",
  "Oshawa",
  "Windsor",
  "Saskatoon",
  "Regina",
  "St_Johns",
  "Kelowna",
];

export default function ReviewForm({ onSubmit }) {
  const [comment, setComment] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = () => {
    //TODO: Add LOGIC TO SUBMIT
    // if (!comment || !city) return;
    // onSubmit({ comment, city });
    // setComment("");
    //
    // setCity("");
  };

  return (
    <Card className="max-w-lg w-full">
      <CardBody className="space-y-4">
        <h2 className="text-xl font-bold">Write a Review</h2>
        <Select
          label="Select a City"
          placeholder="Choose..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          classNames={{
            listbox: "bg-gray-900 text-gray-100", // dropdown items
            popoverContent: "bg-gray-900 text-gray-100", // dropdown container
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
        <Button color="primary" onPress={handleSubmit}>
          Submit Review
        </Button>
      </CardBody>
    </Card>
  );
}
