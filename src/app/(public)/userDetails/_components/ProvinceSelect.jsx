"use client";

import { Select, SelectItem } from "@heroui/react";

const PROVINCES = [
  { label: "No Preference", value: "" },
  { label: "Alberta", value: "AB" },
  { label: "British Columbia", value: "BC" },
  { label: "Manitoba", value: "MB" },
  { label: "New Brunswick", value: "NB" },
  { label: "Newfoundland & Labrador", value: "NL" },
  { label: "Nova Scotia", value: "NS" },
  { label: "Ontario", value: "ON" },
  { label: "Prince Edward Island", value: "PE" },
  { label: "Québec", value: "QC" },
  { label: "Saskatchewan", value: "SK" },
];

export default function ProvinceSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Select Province</h2>
      <Select
        placeholder="Choose province"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const [first] = Array.from(keys);
          onChange(first || "");
        }}
        className="w-full"
      >
        {PROVINCES.map((province) => (
          <SelectItem key={province.value} value={province.value}>
            {province.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
