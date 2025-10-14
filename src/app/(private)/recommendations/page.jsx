"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import { getUserRecommendationsByEmail } from "../../../repositories/recommendations";
import RecommendationsGrid from "./_components/RecommendationsGrid";
import EmptyState from "./_components/EmptyState";

export default function RecommendationsPage() {
  const router = useRouter();
  const user = useAuthInfo();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const fetchedRef = useRef(false); // prevents double fetch in React Strict Mode (dev)

  useEffect(() => {
    if (!user?.email) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const data = await getUserRecommendationsByEmail(user.email);
        setRecs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load recommendations", e);
        setRecs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.email]);

  if (!user) return null; // private layout already gates auth

  if (!loading && recs.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Recommended Cities</h1>
        <EmptyState />
      </div>
    );
  }

  const handleCityClick = (name) => {
    const displayName = name.replace(/_/g, " ");
    router.push(`/city/${encodeURIComponent(displayName)}`);
  };

  // simple image resolver for now (Unsplash). swap later for S3/CDN.
  const getImageUrl = (city, province) =>
    `https://source.unsplash.com/featured/?${encodeURIComponent(
      `${city.replace(/_/g, " ")} Canada`
    )}`;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Recommended Cities</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <RecommendationsGrid
          recs={recs}
          onCityClick={handleCityClick}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
}
