"use client";
import { Card, CardBody, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const popularCities = [
  {
    name: "Toronto",
    image: "https://images.unsplash.com/photo-1568346599629-b83cc813bc8c?w=600",
    sectors: ["Finance", "Technology", "Healthcare", "Film/TV"],
    healthcare: "World-class hospitals, shortest specialist wait times",
    safety: "High; safe for newcomers and families",
    community: "Diverse, inclusive, vibrant culture",
  },
  {
    name: "Vancouver",
    image: "https://images.unsplash.com/photo-1522108700534-0e3c5dfa233b?w=600",
    sectors: ["Tech", "Film/TV", "Tourism", "Green Energy"],
    healthcare: "Top-rated facilities, but longer wait times",
    safety: "Very high; low violent crime rate",
    community: "Multicultural, nature lovers, eco-friendly",
  },
  {
    name: "Calgary",
    image: "https://images.unsplash.com/photo-1698675362107-1f3b348338e5?w=600",
    sectors: ["Energy", "Technology", "Logistics", "Education"],
    healthcare: "Modern facilities, reasonable wait times",
    safety: "Safe, low crime, strong sense of community",
    community: "Family-friendly, outdoor lifestyle",
  },
  {
    name: "Ottawa",
    image: "https://images.unsplash.com/photo-1732656278145-449d7d7781fa?w=600",
    sectors: ["Government", "Tech", "Education", "Healthcare"],
    healthcare: "Strong coverage, top hospital rating",
    safety: "Very safe, government stability",
    community: "Bilingual, welcoming, scenic parks",
  },
  {
    name: "Halifax",
    image: "https://images.unsplash.com/photo-1636069903053-a54901b93473?w=600",
    sectors: ["Education", "Oceans/Marine", "Tourism", "Tech"],
    healthcare: "Accessible, good quality, newer hospitals",
    safety: "Moderate to high; friendly neighborhoods",
    community: "Young, university city, coastal vibe",
  }
];

export default function PopularCitiesList() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto mt-12 items-center">
      {popularCities.map((city) => (
        <Card key={city.name} className="shadow-lg w-full flex justify-center">
          <CardBody className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-3">{city.name}</h2>
            <img
              src={city.image}
              alt={city.name}
              className="rounded-lg max-h-56 object-cover shadow mb-4"
              style={{ width: "80%", maxWidth: 400 }}
            />
            <div className="mb-1"><strong>Growing Sectors:</strong> <span>{city.sectors.join(", ")}</span></div>
            <div className="mb-1"><strong>Healthcare:</strong> <span>{city.healthcare}</span></div>
            <div className="mb-1"><strong>Safety:</strong> <span>{city.safety}</span></div>
            <div className="mb-3"><strong>Community:</strong> <span>{city.community}</span></div>
            <Button
              color="primary"
              onPress={() => router.push(`/city/${(city.name)}`)}
            >
              More Details
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
