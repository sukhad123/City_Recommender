"use client";

import { RadioGroup, Radio } from "@heroui/react";

const OPTIONS = ["Student", "Family", "Professional", "Retiree"];

export default function LifeStage({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="font-semibold">Life Stage / Situation</h2>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        orientation="horizontal"  // change to "vertical" if you want stacked layout
      >
        {OPTIONS.map((opt) => (
          <Radio key={opt} value={opt}>
            {opt}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
