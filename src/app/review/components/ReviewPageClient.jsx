"use client";
import { useEffect, useState } from "react";
import ReviewModalClient from "./ReviewModalClient";
import ReviewFilter from "./ReviewFilter";
import ReviewList from "./ReviewList";

export default function ReviewPageClient({ initialCity = "" }) {
  const [city, setCity] = useState(initialCity);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchReviews(city) {
    setLoading(true);
    let url = "/api/reviews";
    if (city) url += `?city=${encodeURIComponent(city)}`;
    const res = await fetch(url);
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchReviews(city);
  }, [city]);

  return (
    <>
      <ReviewModalClient onReviewAdded={() => fetchReviews(city)} />
      <ReviewFilter selectedCity={city} onChange={setCity} />
      <ReviewList reviews={reviews} loading={loading} />
    </>
  );
}
