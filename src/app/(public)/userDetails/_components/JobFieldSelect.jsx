"use client";

import { Select, SelectItem } from "@heroui/react";

const JOB_OPTIONS = [
  { label: "Tech / IT / Software", value: "tech" },
  { label: "Finance / Accounting", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Construction / Trades", value: "construction" },
  { label: "Education / Teaching", value: "education" },
  { label: "Engineering", value: "engineering" },
  { label: "Logistics / Supply Chain", value: "logistics" },
  { label: "Retail / Customer Service", value: "retail" },
  { label: "Business / Admin / HR", value: "business_admin" },
  { label: "Hospitality / Tourism", value: "hospitality" },
  { label: "Marketing / Media", value: "marketing" },
  { label: "Legal / Law Enforcement", value: "legal" },
  { label: "Manufacturing / Factory", value: "manufacturing" },
  { label: "Agriculture / Farming", value: "agriculture" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Government / Public Sector", value: "government" },
  { label: "Students / Entry-Level", value: "student" },
  { label: "Retired / Not Working", value: "retired" },
];

export default function JobFieldSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Select Job Field:</h2>
      <Select
        placeholder="Choose a job field"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const [first] = Array.from(keys);
          onChange(first || "");
        }}
      >
        {JOB_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
