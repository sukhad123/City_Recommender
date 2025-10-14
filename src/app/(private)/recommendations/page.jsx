"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import { getUserRecommendationsByEmail } from "../../../repositories/recommendations";

export default function RecommendationsPage() {
  const router = useRouter();
  const user = useAuthInfo();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
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
    }
    load();
  }, [user?.email]);

  if (!user) return null; // your private layout already gates auth

  // Empty-state message
  if (!loading && recs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
        <h2 className="text-2xl font-semibold">No recommendations yet</h2>
        <p className="text-gray-500">
          Please fill in your user preferences to get recommendations.
        </p>
      </div>
    );
  }

  // Simple grid list of recommended cities
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Recommended Cities</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recs.map((r) => {
            const displayName = r.city.replace(/_/g, " ");
            const href = `/city/${encodeURIComponent(displayName)}`;

            // Placeholder image (swap later if you store URLs in DB)
            const imgSrc = `https://source.unsplash.com/featured/?${encodeURIComponent(
              displayName + " Canada"
            )}`;

            return (
              <Card
                key={`${r.rank}-${r.city}`}
                isPressable
                onPress={() => router.push(href)}
                shadow="sm"
                className="overflow-hidden"
              >
                <Image
                  removeWrapper
                  alt={displayName}
                  src={imgSrc}
                  className="w-full h-40 object-cover"
                />
                <CardBody className="space-y-1">
                  <p className="text-lg font-semibold">{displayName}</p>
                  <p className="text-xs text-gray-500">
                    {r.province} • Score {Math.round((r.score ?? 0) * 10) / 10}{" "}
                    • Rank {r.rank}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
