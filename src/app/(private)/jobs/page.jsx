"use client";

import { useState, useEffect } from "react";
import SearchForm from "./_components/SearchForm";
import JobList from "./_components/JobList";
import { searchJobs } from "../../../repositories/jobs";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import { useSearchParams } from "next/navigation";
import { getUserPreferences } from "../../../repositories/userPrefs";

export default function JobsPage() {
  const user = useAuthInfo(); // private area already gated by (private) layout
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const searchParams = useSearchParams();
  const cityFromUrl = searchParams.get("city");
  const provinceFromUrl = searchParams.get("province");

  useEffect(() => {
    if (!cityFromUrl || !provinceFromUrl) return;

    async function autoSearchFromCity() {
      // 1️⃣ Fetch user's saved preference
      const prefs = await getUserPreferences(user.email);

      // 2️⃣ Convert jobField → job title
      const jobTitleMap = {
        tech: "Software Developer",
        finance: "Financial Analyst",
        healthcare: "Nurse",
        construction: "Construction Worker",
        education: "Teacher",
        engineering: "Engineer",
        logistics: "Supply Chain Associate",
        retail: "Retail Associate",
        business_admin: "Office Administrator",
        hospitality: "Hotel Staff",
        marketing: "Marketing Specialist",
        legal: "Legal Assistant",
        manufacturing: "Factory Worker",
        agriculture: "Farm Worker",
        real_estate: "Real Estate Agent",
        government: "Public Service",
        student: "Intern",
        retired: "Part Time",
      };

      const title = jobTitleMap[prefs?.jobField] || "General Worker";

      await handleSearch({
        title,
        city: cityFromUrl,
        province: provinceFromUrl,
      });
    }

    autoSearchFromCity();
  }, [cityFromUrl, provinceFromUrl]);

  async function handleSearch(params) {
    setLoading(true);
    try {
      const jobs = await searchJobs(params);
      setResults(jobs);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Find Jobs</h1>
      <p className="text-gray-500">
        Search Canada-wide by province, city (optional), and job title.
      </p>

      <SearchForm onSearch={handleSearch} />
      <JobList jobs={results} loading={loading} />
    </div>
  );
}
