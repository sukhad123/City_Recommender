"use client";

import { Select, SelectItem } from "@heroui/react";

const OPTIONS = ["Cold", "Moderate", "Warm"];

export default function WeatherPrefSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Weather Preference</h2>
      <Select
        placeholder="Choose weather preference"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys).join("");
          onChange(selected);
        }}
        className="w-full"
      >
        {OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
