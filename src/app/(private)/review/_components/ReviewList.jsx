"use client";
import { getAllReviews } from "../../../../repositories/review";
import { useEffect, useState } from "react";
import { Card, CardBody, Spinner, Button } from "@heroui/react";
import ReviewForm from "./ReviewForm";
import { CitySearch } from "../../../../utils/CitySearch";
import { cities } from "../../../../utils/cities";

export default function ReviewList({ email }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("");
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
  const filteredReviews = !selectedCity
    ? reviews
    : reviews.filter((r) => r.city === selectedCity);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl space-y-6 pb-16">
      {" "}
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex flex-1 min-w-[260px] items-center gap-3">
          <CitySearch
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities}
            placeholder="Search by city..."
            className="w-full"
          />
          <Button
            color="primary"
            style={{ backgroundColor: "#2563eb", color: "#fff" }}
            className="h-[44px] min-w-[114px] px-4 font-medium"
            onPress={() => setSelectedCity("")}
            disabled={!selectedCity}
          >
            Show All
          </Button>
        </div>
        <Button
          color="primary"
          className="h-[44px] sm:w-auto min-w-[150px] font-medium"
          onPress={() => setShowForm((v) => !v)}
        >
          {showForm ? "Hide Review Form" : "Write a Review"}
        </Button>
      </div>
      {showForm && (
        <div className="w-full mb-6">
          <ReviewForm email={email} onSubmit={() => setShowForm(false)} />
        </div>
      )}
      {filteredReviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet.</p>
      ) : (
        <div className="grid gap-6 w-full">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="w-full rounded-xl p-5">
              <CardBody className="space-y-2">
                <p className="text-sm text-primary font-semibold">
                  {review.city.replace("_", " ")}
                </p>
                <p className="text-lg text-gray-100">{review.comment}</p>
                <p className="text-xs text-gray-400">
                  by {review.user?.name ?? "Anonymous"} &middot;{" "}
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
