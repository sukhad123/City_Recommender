export default function CityHeader({ title, subtitle, imageUrl }) {
  return (
    <div className="rounded-2xl overflow-hidden border">
      <div className="h-56 w-full bg-gray-200">
        <img src={imageUrl} alt={title} className="h-56 w-full object-cover" />
      </div>
      <div className="px-5 py-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle ? <p className="text-gray-500 mt-1">{subtitle}</p> : null}
      </div>
    </div>
  );
}
