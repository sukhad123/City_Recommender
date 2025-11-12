import { Chip } from '@heroui/react'

/**
 * items: [{ label: string, value: string }]
 */
export default function KeyValueList({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-default-500 text-sm italic">
        No data available
      </p>
    );
  }
  
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((it, idx) => (
        <div 
          key={`${it.label}-${idx}`} 
          className="flex justify-between items-center gap-4 p-3 bg-default-50 rounded-lg"
        >
          <dt className="text-default-600 font-medium">{it.label}</dt>
          <dd className="font-semibold text-foreground">
            {typeof it.value === 'number' ? it.value.toLocaleString() : it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
