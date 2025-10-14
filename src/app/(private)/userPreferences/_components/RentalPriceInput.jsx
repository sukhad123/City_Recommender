"use client";

import { Input } from "@heroui/react";

export default function RentalPriceInput({ value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Monthly Rental Budget ($):</h2>
      <Input
        type="number"
        placeholder="Enter rental budget"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={0}
        aria-invalid={!!error}
        className="w-full"
      />
      {error ? (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      ) : null}
    </div>
  );
}
