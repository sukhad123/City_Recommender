"use client";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Link from "next/link";
import { 
  Card, 
  CardBody, 
  Spinner, 
  Spacer
} from '@heroui/react'
import { Building2, MapPin } from 'lucide-react'
import { recommendedCitiesAtom } from "../../../store/cities";

export default function CitiesPage() {
  const [cities, setCities] = useAtom(recommendedCitiesAtom);
  const [loading, setLoading] = useState(true);
  
  
  console.log("Cities from store:", cities);

  useEffect(() => {
    // Simulate loading delay and check if we have cities
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [cities]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <CardBody className="text-center">
            <Spinner size="lg" color="primary" />
            <Spacer y={4} />
            <p className="text-default-600">Loading recommended cities...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardBody className="text-center py-8">
          <div className="flex justify-center mb-4">
            <Building2 size={48} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Recommended Cities
          </h1>
          <p className="text-default-600">
            Discover the best cities for you based on your preferences
          </p>
        </CardBody>
      </Card>

      {!cities || cities.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-6xl mb-4">🏙️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No cities found
            </h3>
            <p className="text-default-500">
              We couldn't find any recommended cities for you at the moment.
              <br />
              Please complete your preferences first to get recommendations.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, index) => (
            <Card 
              key={index} 
              isPressable 
              className="hover:scale-105 transition-transform duration-200"
              shadow="sm"
            >
              <Link href={`/city/${encodeURIComponent(city)}`}>
                <CardBody className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    <MapPin size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {city}
                  </h3>
                  <p className="text-sm text-default-500">
                    Click to view details
                  </p>
                </CardBody>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <Spacer y={6} />
      
      <Card>
        <CardBody className="text-center py-4">
          <p className="text-sm text-default-500">
            {cities?.length || 0} cities recommended for you
          </p>
          <p className="text-xs text-default-400 mt-2">
            Tip: Explore smaller cities — they often offer the best quality of life ✨
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
