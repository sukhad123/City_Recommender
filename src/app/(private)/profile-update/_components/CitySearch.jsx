import { useState, useRef } from "react";
import { Input } from "@heroui/react";
import { cities } from "../../../../utils/cities";

export function CitySearch({ value, onChange, disabled }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const filtered = search.trim()
    ? cities.filter((city) => city.toLowerCase().includes(search.toLowerCase()))
    : cities;

  // Show parent value in input unless searching
  const displayedValue = isOpen ? search : (value ? value.replace("_", " ") : "");

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder="Search city…"
        value={displayedValue}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        disabled={disabled}
        className="mb-2"
        color="default"
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <div className="w-full rounded-md border border-gray-700 bg-gray-900 shadow-lg z-10 max-h-60 overflow-y-auto mt-1">
          {filtered.map((city) => (
            <div
              key={city}
              className={`px-4 py-2 cursor-pointer text-foreground hover:bg-gray-800 ${value === city ? "bg-gray-800" : ""}`}
              onMouseDown={() => {
                onChange(city);
                setSearch(city.replace("_", " "));
                setIsOpen(false);
              }}
            >
              {city.replace("_", " ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
