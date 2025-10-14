export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">About City Recommender</h1>

      <p className="mt-4 text-base leading-relaxed">
        City Recommender helps people choose where to live in Canada. We combine your preferences
        with a machine-learning model to suggest cities and neighborhoods beyond the usual hotspots.
        You’ll see practical info (cost, jobs, schools, healthcare, community) and reviews that
        reflect lived experiences — so your choice is clearer and more confident.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Who it’s for</h2>
      <p className="mt-3 leading-relaxed">
        New immigrants and current residents seeking better fit — affordability, jobs, and community —
        not just the biggest cities.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">What we provide</h2>
      <ul className="mt-3 list-disc pl-5 space-y-2">
        <li><strong>ML-powered recommendations</strong> based on your preferences.</li>
        <li><strong>City profiles</strong> with cost of living, jobs, education, healthcare, and community resources.</li>
        <li><strong>Reviews & ratings</strong> to capture real experiences.</li>
        <li><strong>Save & compare</strong> cities you’re considering.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Our principles</h2>
      <ul className="mt-3 list-disc pl-5 space-y-2">
        <li><strong>Clarity first</strong> — clean layouts, readable typography, no noise.</li>
        <li><strong>Accessibility</strong> — semantic headings, keyboard-friendly, sensible announce order.</li>
        <li><strong>Trust</strong> — practical data and reviews; plain-language guidance for newcomers.</li>
      </ul>
    </main>
  );
}
