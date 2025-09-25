"use client";
import { Select, SelectItem } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

const canadianCities = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Kitchener",
  "London",
  "Victoria",
  "Halifax",
  "Oshawa",
  "Windsor",
  "Saskatoon",
  "Regina",
  "St. John's",
  "Kelowna",
];

export default function ReviewFilter({ selectedCity, onChange }) {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <Select
      label="Filter by City"
      selectedKeys={selectedCity ? [selectedCity] : []}
      onSelectionChange={(keys) => {
        const city = Array.from(keys)[0] || "";
        onChange(city);

        const newParams = new URLSearchParams(params.toString());
        if (city) {
          newParams.set("city", city);
        } else {
          newParams.delete("city");
        }
        router.replace(`/review?${newParams.toString()}`);
      }}
      className="w-full"
    >
      <SelectItem key="">All Cities</SelectItem>
      {canadianCities.map((city) => (
        <SelectItem key={city}>{city}</SelectItem>
      ))}
    </Select>
  );
}
