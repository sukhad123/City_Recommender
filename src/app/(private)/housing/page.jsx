"use client";

import { useState, useEffect } from "react";
import SearchForm from "./_components/SearchForm";
import HousingList from "./_components/HousingList";
import { searchHousing } from "../../../repositories/housing";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import { useSearchParams } from "next/navigation";

export default function HousingPage() {
  const user = useAuthInfo(); // private layout gates auth
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  const searchParams = useSearchParams();
  const cityFromUrl = searchParams.get("city");
  const provinceFromUrl = searchParams.get("province");

  useEffect(() => {
    if (!cityFromUrl) return;

    async function autoSearchFromCity() {
      await handleSearch({
        listingType: "for_rent", // default
        city: cityFromUrl,
        bedrooms: undefined,
        bathrooms: undefined,
      });
    }

    autoSearchFromCity();
  }, [cityFromUrl]);

  async function handleSearch(params) {
    setLoading(true);
    try {
      const data = await searchHousing(params);
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("[Housing] search failed", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Find Housing</h1>
      <p className="text-gray-500">
        Search by province & city, listing type, and beds/baths.
      </p>

      <SearchForm onSearch={handleSearch} />

      <HousingList listings={listings} loading={loading} />
    </div>
  );
}
