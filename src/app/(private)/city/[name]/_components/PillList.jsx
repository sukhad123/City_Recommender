export default function PillList({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-gray-500 text-sm">No data available</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <span
          key={`${it}-${idx}`}
          className="px-3 py-1 rounded-full border text-sm"
        >
          {it}
        </span>
      ))}
    </div>
  );
}
