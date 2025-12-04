"use client";
import Link from "next/link";
import { PROVINCES } from "../../../../constants/geo/provinces";

const ALL_CITIES_KEY = "*";

import { useState, useMemo, useEffect } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
} from "@heroui/react";

// Provinces
// const PROVINCES = [
//   { code: "AB", name: "Alberta" },
//   { code: "BC", name: "British Columbia" },
//   { code: "MB", name: "Manitoba" },
//   { code: "NB", name: "New Brunswick" },
//   { code: "NL", name: "Newfoundland and Labrador" },
//   { code: "NS", name: "Nova Scotia" },
//   { code: "ON", name: "Ontario" },
//   { code: "PE", name: "Prince Edward Island" },
//   { code: "QC", name: "Quebec" },
//   { code: "SK", name: "Saskatchewan" },
// ];

// Minimal demo list—swap for your full per-province map if available
// const CITIES_BY_PROVINCE = {
//   ON: ["Toronto", "Mississauga", "Ottawa", "London", "Kitchener", "Waterloo"],
//   BC: ["Vancouver", "Surrey", "Burnaby", "Richmond", "Victoria", "Kelowna"],
//   QC: ["Montreal", "Quebec City", "Laval", "Gatineau"],
//   AB: ["Calgary", "Edmonton", "Red Deer"],
//   MB: ["Winnipeg"],
//   NS: ["Halifax"],
//   NB: ["Moncton", "Saint John", "Fredericton"],
//   NL: ["St. John's"],
//   PE: ["Charlottetown"],
//   SK: ["Saskatoon", "Regina"],
// };

const BED_OPTIONS = ["", "1+", "2+", "3+", "4+"];
const BATH_OPTIONS = ["", "1+", "2+", "3+", "4+"];

// Convert "2+" -> "2-0" (actor expects this format)
function plusToRange(s) {
  if (!s) return undefined;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? `${n}-0` : undefined;
}

export default function SearchForm({ onSearch }) {
  const [listingType, setListingType] = useState("for_rent"); // "for_rent" | "for_sale"
  const [province, setProvince] = useState("ON");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState(""); // "2+"
  const [bathrooms, setBathrooms] = useState(""); // "1+"

  const [cityMap, setCityMap] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await import(
        "../../../../constants/geo/canadian-cities.json"
      );
      if (mounted) setCityMap(data.default || data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cities = useMemo(() => cityMap[province] ?? [], [cityMap, province]);

  const submit = () => {
    // Apify actor requires city (we use province only to filter city list)
    if (!city) {
      alert("Please select a city.");
      return;
    }

    onSearch({
      listingType,
      city,
      bedrooms: plusToRange(bedrooms),
      bathrooms: plusToRange(bathrooms),
    });
  };

  return (
    <div className="rounded-xl border p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {/* Listing type */}
      <div className="min-w-0">
        <RadioGroup
          label="Listing type"
          orientation="horizontal"
          value={listingType}
          onValueChange={setListingType}
        >
          <Radio value="for_rent">Rent</Radio>
          <Radio value="for_sale">Buy</Radio>
        </RadioGroup>
      </div>

      {/* Province */}
      <div className="min-w-0">
        <Autocomplete
          label="Province"
          selectedKey={province}
          onSelectionChange={(key) => {
            setProvince(String(key));
            setCity("");
          }}
          allowsCustomValue={false}
          defaultItems={PROVINCES}
          className="w-full"
        >
          {PROVINCES.map((p) => (
            <AutocompleteItem key={p.code} value={p.code}>
              {p.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      {/* City (required) */}
      <div className="min-w-0">
        <Autocomplete
          label="City"
          defaultItems={cities}
          selectedKey={city || null}
          inputValue={city}
          onInputChange={setCity}
          onSelectionChange={(key) => setCity(String(key))}
          allowsCustomValue
          className="w-full"
          placeholder="Select or type a city"
        >
          {cities.map((c) => (
            <AutocompleteItem key={c}>{c}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      {/* Bedrooms */}
      <div className="min-w-0">
        <Select
          label="Bedrooms"
          selectedKeys={bedrooms ? [bedrooms] : []}
          onSelectionChange={(keys) => {
            const first = Array.from(keys)[0] || "";
            setBedrooms(first);
          }}
          className="w-full"
        >
          <SelectItem key="">Any</SelectItem>
          {BED_OPTIONS.filter(Boolean).map((v) => (
            <SelectItem key={v}>{v}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="min-w-0">
        <Select
          label="Bathrooms"
          selectedKeys={bathrooms ? [bathrooms] : []}
          onSelectionChange={(keys) => {
            const first = Array.from(keys)[0] || "";
            setBathrooms(first);
          }}
          className="w-full"
        >
          <SelectItem key="">Any</SelectItem>
          {BATH_OPTIONS.filter(Boolean).map((v) => (
            <SelectItem key={v}>{v}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Submit */}
      <div className="sm:col-span-2 md:col-span-3 xl:col-span-6 flex justify-end">
        <Button as={Link} href="/housing/saved" variant="flat">
          View Saved
        </Button>
        <Button color="primary" onPress={submit}>
          Search
        </Button>
      </div>
    </div>
  );
}
