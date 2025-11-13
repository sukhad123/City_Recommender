"use client";

import { Card, CardBody, CardHeader, Button, Image, Chip } from "@heroui/react";

function formatCAD(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}

export default function HousingCard({ listing }) {
  const price =
    listing.priceText?.trim() ||
    (listing.price != null ? formatCAD(listing.price) : "—");
  const typeLabel = listing.type || "—";

  return (
    <Card shadow="sm" className="overflow-hidden">
      <div className="relative">
        <Image
          removeWrapper
          src={listing.image}
          alt={listing.title}
          className="w-full h-44 object-cover"
        />
        {price !== "—" && (
          <Chip
            className="absolute top-2 left-2"
            color="primary"
            variant="solid"
            size="sm"
          >
            {price}
          </Chip>
        )}
      </div>

      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold line-clamp-2">
            {listing.title}
          </h3>
          <span className="text-base font-semibold whitespace-nowrap">
            {price}
          </span>
        </div>
        <p className="text-sm text-gray-500">{listing.address}</p>
      </CardHeader>

      <CardBody className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span
            className="
              px-2 py-1 rounded
              bg-gray-200 text-gray-900
              dark:bg-gray-800 dark:text-gray-100
            "
            title={typeLabel}
          >
            {typeLabel}
          </span>

          <span className="text-gray-600 dark:text-gray-300">
            {listing.beds != null ? `${listing.beds} bd` : "—"}
          </span>
          <span className="text-gray-600 dark:text-gray-300">
            {listing.baths != null ? `${listing.baths} ba` : "—"}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            as="a"
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            View Listing
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
