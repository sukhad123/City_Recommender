/**
 * items: [{ label: string, value: string }]
 */
export default function KeyValueList({ items = [] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500 text-sm">No data available</p>;
  }
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {items.map((it, idx) => (
        <div key={`${it.label}-${idx}`} className="flex justify-between gap-4">
          <dt className="text-gray-500">{it.label}</dt>
          <dd className="font-medium">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
