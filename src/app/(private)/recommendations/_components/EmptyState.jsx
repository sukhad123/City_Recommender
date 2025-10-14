"use client";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-3 rounded-lg border p-8">
      <h2 className="text-2xl font-semibold">No recommendations yet</h2>
      <p className="text-gray-500">
        Please fill in your user preferences to get recommendations.
      </p>
    </div>
  );
}
