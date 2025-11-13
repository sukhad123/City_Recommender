"use client";

export default function CitySidePanel({ city, onClose, onOpenCity }) {
  const open = !!city;
  if (!open) return null;

  const cad = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-CA", {
          style: "currency",
          currency: "CAD",
          maximumFractionDigits: 0,
        })
      : "—";

  const demandPairs = Object.entries(city.jobs?.demandByField || {});
  const topIndustries = city.jobs?.topIndustries || [];
  const growing = city.jobs?.growingSectors || [];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] 
      bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 z-[5000]
      ${open ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {city.city}
          {city.province ? `, ${city.province}` : ""}
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          Close
        </button>
      </div>

      <div className="p-4 space-y-5 text-sm text-gray-800 dark:text-gray-200">
        {/* Population */}
        <Section title="Population">
          <KV
            label="Total"
            value={
              city.population != null
                ? city.population.toLocaleString()
                : "—"
            }
          />
        </Section>

        {/* Cost of Living */}
        <Section title="Cost of Living (est.)">
          <KV label="Single / mo" value={cad(city.costOfLiving?.singleMonthly)} />
          <KV label="Family / mo" value={cad(city.costOfLiving?.familyMonthly)} />
        </Section>

        {/* Job Opportunities */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-gray-900 dark:text-gray-100">
            Job Opportunities
          </h4>

          {topIndustries.length ? (
            <Pills title="Top Industries" items={topIndustries} />
          ) : null}

          {growing.length ? (
            <Pills title="Growing Sectors" items={growing} />
          ) : null}

          {demandPairs.length ? (
            <div className="mt-3">
              <div className="text-gray-500 dark:text-gray-400 mb-1">
                Demand by Field (0–10)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {demandPairs.map(([k, v]) => (
                  <KV key={k} label={k} value={String(v)} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold mb-2 text-sm text-gray-900 dark:text-gray-100">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div className="border rounded-lg p-2 border-gray-200 dark:border-gray-700">
      <div className="text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {value ?? "—"}
      </div>
    </div>
  );
}

function Pills({ title, items }) {
  return (
    <div className="mb-2">
      <div className="text-gray-500 dark:text-gray-400 mb-1">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
