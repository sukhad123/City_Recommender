"use client";

import { Select, SelectItem } from "@heroui/react";

const LANGUAGES = ["English", "French", "Bilingual"];

export default function LanguagePrefSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Language Preference</h2>
      <Select
        placeholder="Choose language"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const [first] = Array.from(keys);
          onChange(first || "");
        }}
        className="w-full"
      >
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
