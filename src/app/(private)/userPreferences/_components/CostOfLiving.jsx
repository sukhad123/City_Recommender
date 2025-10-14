"use client";

import { RadioGroup, Radio } from "@heroui/react";

export default function CostOfLiving({ value, onChange }) {
  const options = ["Low", "Medium", "High"];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold">Cost of Living:</h2>
      <RadioGroup value={value} onValueChange={onChange} orientation="horizontal">
        {options.map((opt) => (
          <Radio key={opt} value={opt}>
            {opt}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
