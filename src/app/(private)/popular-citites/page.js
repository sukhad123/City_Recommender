import PopularCitiesList from "./_components/PopularCitiesList";

export default function PopularCitiesPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mt-8 mb-4">
        Popular Canadian Cities
      </h1>
      <PopularCitiesList />
    </main>
  );
}