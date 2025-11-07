"use client";
import { getAllReviews } from "../../../../repositories/review";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Spinner,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import ReviewForm from "./ReviewForm";

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

export default function ReviewList({ email }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [showForm, setShowForm] = useState(false);

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

  // Filter reviews by city if selected
  const filteredReviews =
    selectedCity === "All"
      ? reviews
      : reviews.filter((r) => r.city === selectedCity);

  return (
    <div className="flex flex-col items-start align-start w-full max-w-2xl space-y-6">
      {/* Top Bar: Filter & Write Button */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-4 mb-6">
        <Select
          label="Filter by City"
          selectedKeys={[selectedCity]}
          onChange={(e) => setSelectedCity(e.target.value)}
          classNames={{
            listbox: "bg-gray-900 text-gray-100",
            popoverContent: "bg-gray-900 text-gray-100",
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
        <Button
          color="primary"
          className="w-full sm:w-auto"
          onPress={() => setShowForm((v) => !v)}
        >
          {showForm ? "Hide Review Form" : "Write a Review"}
        </Button>
      </div>

      {/* Review Form (inline, toggled) */}
      {showForm && (
        <div className="w-full mb-6">
          <ReviewForm email={email} onSubmit={() => setShowForm(false)} />
        </div>
      )}

      {/* No reviews */}
      {filteredReviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet.</p>
      ) : (
        <div className="grid gap-4 w-full">
          {filteredReviews.map((review) => (
            <Card key={review.id} shadow="sm">
              <CardBody className="space-y-1">
                <p className="text-sm text-gray-500">
                  {review.city.replace("_", " ")}
                </p>
                <p className="text-lg">{review.comment}</p>
                <p className="text-xs text-gray-400">
                  by {review.user?.name ?? "Anonymous"} ·{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
