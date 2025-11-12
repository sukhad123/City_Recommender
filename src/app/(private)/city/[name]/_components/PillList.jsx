import { Chip } from '@heroui/react'

export default function PillList({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <p className="text-default-500 text-sm italic">
        No data available
      </p>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <Chip
          key={`${it}-${idx}`}
          size="sm"
          variant="flat"
          color="primary"
          className="text-sm"
        >
          {it}
        </Chip>
      ))}
    </div>
  );
}
