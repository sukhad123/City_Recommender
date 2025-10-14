"use client";

import { Select, SelectItem } from "@heroui/react";

const OPTIONS = ["Small", "Medium", "Large"];

export default function CitySizeSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">City Size Preference</h2>
      <Select
        placeholder="Choose city size"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const [first] = Array.from(keys);
          onChange(first || "");
        }}
        className="w-full"
      >
        {OPTIONS.map((size) => (
          <SelectItem key={size} value={size}>
            {size}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
