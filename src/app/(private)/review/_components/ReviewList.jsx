"use client";
import { getAllReviews } from "../../../../repositories/review";
import { useEffect, useState } from "react";
import { Card, CardBody, Spinner, Select, SelectItem } from "@heroui/react";

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

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await getAllReviews();
        setReviews(res);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-gray-500 text-center">No reviews yet.</p>;
  }

  // Filter reviews by city if selected
  const filteredReviews =
    selectedCity === "All"
      ? reviews
      : reviews.filter((r) => r.city === selectedCity);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl space-y-6">
      {/* City Filter */}
      <Select
        label="Filter by City"
        className="max-w-xs"
        selectedKeys={[selectedCity]}
        onChange={(e) => setSelectedCity(e.target.value)}
        classNames={{
          listbox: "bg-gray-900 text-gray-100", // dropdown items
          popoverContent: "bg-gray-900 text-gray-100", // dropdown container
        }}
      >
        <SelectItem key="All" value="All">
          All Cities
        </SelectItem>
        {canadianCities.map((c) => (
          <SelectItem key={c} value={c}>
            {c.replace("_", " ")}
          </SelectItem>
        ))}
      </Select>

      {/* Review Cards */}
      <div className="grid gap-4 w-full">
        {filteredReviews.map((review) => (
          <Card key={review.id} shadow="sm">
            <CardBody className="space-y-1">
              <p className="text-sm text-gray-500">
                {review.city.replace("_", " ")}
              </p>
              <p className="text-lg">{review.comment}</p>
              <p className="text-xs text-gray-400">
                by {review.user?.email ?? "Anonymous"} ·{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
