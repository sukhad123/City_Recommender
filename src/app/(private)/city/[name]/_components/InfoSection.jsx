export default function InfoSection({ title, subtitle, children }) {
  return (
    <section className="rounded-xl border p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
