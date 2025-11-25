"use client";

import { Card, CardBody, Image } from "@heroui/react";

export default function RecommendationCard({
  city,
  province,
  score,
  rank,
  imageUrl,
  onPress,
}) {
  const displayName = city.replace(/_/g, " ");

  return (
    <Card
      isPressable
      onPress={onPress}
      shadow="sm"
      className="overflow-hidden"
      key={`${rank}-${city}`}
    >
      <Image
        removeWrapper
        alt={displayName}
        src={imageUrl}
        className="w-full h-40 object-cover"
      />
      <CardBody className="space-y-1">
        <p className="text-lg font-semibold">{displayName}</p>
        <p className="text-xs text-gray-500">
         
        </p>
      </CardBody>
    </Card>
  );
}
