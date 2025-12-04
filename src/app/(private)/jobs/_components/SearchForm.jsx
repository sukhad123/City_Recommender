"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Autocomplete, AutocompleteItem, Input, Button } from "@heroui/react";
import { PROVINCES } from "../../../../constants/geo/provinces";

const ALL_CITIES_KEY = "*";

function includesCi(a, b) {
  return a.toLowerCase().includes(b.toLowerCase());
}

export default function SearchForm({ onSearch }) {
  const [province, setProvince] = useState("ON");
  const [city, setCity] = useState(ALL_CITIES_KEY); // default: “All cities”
  const [title, setTitle] = useState("");

  // lazily load full city map (per province)
  const [cityMap, setCityMap] = useState({});
  const [cityQuery, setCityQuery] = useState("");

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

  const provinceCities = useMemo(() => {
    const raw = cityMap[province] || [];
    const filtered = cityQuery
      ? raw.filter((c) => includesCi(c, cityQuery))
      : raw;
    const pvName =
      PROVINCES.find((p) => p.code === province)?.name || "Province";

    // first option is the “All cities in X” pseudo-item
    return [
      { __all: true, key: ALL_CITIES_KEY, label: `All cities in ${pvName}` },
      ...filtered,
    ].slice(0, 201);
  }, [cityMap, province, cityQuery]);

  const canSearch = province && title.trim().length > 0;

  function handleSearch() {
    onSearch({
      title: title.trim(),
      province,
      city: city === ALL_CITIES_KEY ? null : city, // null => province-wide search
    });
  }

  return (
    <div className="rounded-xl border p-4 grid gap-4 md:grid-cols-[240px_280px_1fr_auto]">
      <Autocomplete
        label="Province / Territory"
        selectedKey={province}
        onSelectionChange={(key) => {
          const pv = String(key);
          setProvince(pv);
          setCity(ALL_CITIES_KEY); // reset to “All cities” when province changes
          setCityQuery("");
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

      <Autocomplete
        label="City (optional)"
        selectedKey={city}
        onSelectionChange={(key) => {
          const value = String(key);
          setCity(value);
          if (value !== ALL_CITIES_KEY) {
            setCityQuery(value); // ✅ this fixes the double-click issue
          } else {
            setCityQuery("");
          }
        }}
        allowsCustomValue={false}
        inputValue={cityQuery}
        onInputChange={setCityQuery}
        defaultItems={provinceCities}
        isDisabled={!province}
        className="w-full"
        placeholder={
          province
            ? "Type to filter… (or pick All cities)"
            : "Select province first"
        }
      >
        {provinceCities.map((c) =>
          c.__all ? (
            <AutocompleteItem key={c.key} value={c.key}>
              {c.label}
            </AutocompleteItem>
          ) : (
            <AutocompleteItem key={c}>{c}</AutocompleteItem>
          )
        )}
      </Autocomplete>

      <Input
        label="Job title"
        placeholder="e.g., Software Engineer"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />

      <Button as={Link} href="/jobs/saved" variant="flat">
        View Saved
      </Button>

      <Button color="primary" onPress={handleSearch} isDisabled={!canSearch}>
        Search
      </Button>
    </div>
  );
}

//------------------------------------------------------------------------
