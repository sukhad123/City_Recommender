"use client";

import { Select, SelectItem } from "@heroui/react";

const OPTIONS = [
  { label: "PR (Permanent Resident)", value: "PR" },
  { label: "Student Visa", value: "Student_Visa" },
  { label: "Work Permit", value: "Work_Permit" },
  { label: "New Immigrant", value: "New_Immigrant" },
];

export default function ImmigrationStatusSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Immigration Status</h2>
      <Select
        placeholder="Choose immigration status"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const [first] = Array.from(keys);
          onChange(first || "");
        }}
        className="w-full"
      >
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
