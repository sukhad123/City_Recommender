"use client";

import JobCard from "./JobCard";

export default function JobList({ jobs, loading }) {
  if (loading) {
    return <p className="text-gray-500">Searching jobs…</p>;
  }
  if (!jobs || jobs.length === 0) {
    return (
      <p className="text-gray-500">No results. Try another title or city.</p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}
