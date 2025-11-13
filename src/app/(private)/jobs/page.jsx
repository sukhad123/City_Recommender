"use client";

import { useState } from "react";
import SearchForm from "./_components/SearchForm";
import JobList from "./_components/JobList";
import { searchJobs } from "../../../repositories/jobs";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";

export default function JobsPage() {
  const user = useAuthInfo(); // private area already gated by (private) layout
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

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
