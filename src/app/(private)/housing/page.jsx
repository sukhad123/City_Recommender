"use client";

import { useState } from "react";
import SearchForm from "./_components/SearchForm";
import HousingList from "./_components/HousingList";
import { searchHousing } from "../../../repositories/housing";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";

export default function HousingPage() {
  const user = useAuthInfo(); // private layout gates auth
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

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
