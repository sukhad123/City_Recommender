"use client";

import LoadingSpinner from "../../../../components/ui/spinner";
import getCityInfo from "../../../../../services/core/cityInformation/getCityInfo";
import { useEffect, useState } from "react";

export default function CityComparePage({ cityName1, cityName2 }) {
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const c1 = await getCityInfo(cityName1);
      const c2 = await getCityInfo(cityName2);
      setCity1Data(c1);
      setCity2Data(c2);
    }
    fetchData();
  }, [cityName1, cityName2]);

  if (!city1Data || !city2Data) return <LoadingSpinner />;

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((o, k) => (o ? o[k] : null), obj);

  const formatCurrency = (n) =>
    typeof n === "number" ? n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }) : "—";

  const metrics = [
    { label: "Population", key: "demographics.population", format: (v) => v.toLocaleString() },
    { label: "Diversity Index", key: "demographics.diversityIndex" },
    { label: "1-Bed Rent", key: "rent.oneBed", format: formatCurrency },
    { label: "2-Bed Rent", key: "rent.twoBed", format: formatCurrency },
    { label: "Shared Rent", key: "rent.shared", format: formatCurrency },
    { label: "Basement Rent", key: "rent.basement", format: formatCurrency },
    { label: "Avg Home Price", key: "realEstate.avgPrice", format: formatCurrency },
    { label: "Real Estate Trend", key: "realEstate.trend" },
    { label: "Crime Index", key: "safetyCrime.crimeIndex" },
    { label: "Police Stations", key: "safetyCrime.policeStations" },
    { label: "Healthcare Wait (days)", key: "healthcare.avgWaitDays" },
    { label: "Clinics Count", key: "healthcare.clinicsCount" },
    { label: "Mental Health Services", key: "healthcare.mentalHealthServices", format: (v) => (v ? "Yes" : "No") },
    { label: "Quality of Life", key: "qualityOfLife.score" },
    { label: "Walk Score", key: "transportation.walkScore" },
    { label: "Bike Lanes (km)", key: "transportation.bikeLanesKm" },
    { label: "Internet Mbps", key: "internetTech.typicalDownMbps" },
    { label: "High-Speed Internet", key: "internetTech.highSpeedAvailability" },
    { label: "Tech Jobs Presence", key: "internetTech.techJobsPresence" },
  ];

  const renderList = (label, items) => (
    <div className="mb-4">
      <h4 className="font-semibold text-lg mb-1">{label}</h4>
      <ul className="list-disc list-inside">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className=" p-6 space-y-8 h-[80vh]  overflow-y-auto">
      <h2 className="text-3xl font-bold text-center mb-6">City Comparison</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[city1Data, city2Data].map((city) => (
          <div
            key={city.city}
            className=" border rounded-xl shadow-lg hover:shadow-xl transition p-6 flex flex-col"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold">{city.city}</h3>
              <p className="text-gray-500">{city.province}</p>
            </div>

            {/* Metrics */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Key Metrics</h4>
              <div className="space-y-2">
                {metrics.map((metric) => (
                  <div key={metric.key} className="flex justify-between border-b py-1">
                    <span className="font-medium">{metric.label}</span>
                    <span>
                      {metric.format
                        ? metric.format(getNestedValue(city, metric.key))
                        : getNestedValue(city, metric.key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {renderList(
              "Education",
              [
                ...city.education.colleges.map((c) => c.name),
                ...city.education.universities.map((u) => u.name),
                ...city.education.schoolBoards,
              ]
            )}

            {/* Healthcare */}
            {renderList(
              "Healthcare",
              [
                ...city.healthcare.hospitals.map((h) => `Hospital: ${h.name} (${h.distanceKm} km)`),
                `Avg Wait Days: ${city.healthcare.avgWaitDays}`,
                `Clinics Count: ${city.healthcare.clinicsCount}`,
                `Mental Health Services: ${city.healthcare.mentalHealthServices ? "Yes" : "No"}`,
              ]
            )}

            {/* Transportation */}
            {renderList(
              "Transportation",
              [
                `Transit: ${city.transportation.transit.join(", ")}`,
                `Airports: ${city.transportation.airports.join(", ")}`,
                `Walk Score: ${city.transportation.walkScore}`,
                `Bike Lanes: ${city.transportation.bikeLanesKm} km`,
              ]
            )}

            {/* Outdoor Lifestyle */}
            {renderList(
              "Outdoor & Lifestyle",
              [
                `Gyms: ${city.outdoorLifestyle.gyms}`,
                `Parks: ${city.outdoorLifestyle.parks}`,
                `Restaurants: ${city.outdoorLifestyle.restaurants}`,
                `Events: ${city.outdoorLifestyle.events.join(", ")}`,
                `Major Parks: ${city.outdoorLifestyle.majorParks.join(", ")}`,
              ]
            )}

            {/* Job Opportunities */}
            {renderList(
              "Job Opportunities",
              [
                `Top Industries: ${city.jobOpportunities.topIndustries.join(", ")}`,
                `Growing Sectors: ${city.jobOpportunities.growingSectors.join(", ")}`,
                ...Object.entries(city.jobOpportunities.demandByField).map(
                  ([field, demand]) => `${field}: ${demand}`
                ),
              ]
            )}

            {/* Immigration & Community */}
            {renderList(
              "Immigration & Community Support",
              [
                `Agencies: ${city.immigrationSupport.agencies.join(", ")}`,
                `Support Groups: ${city.immigrationSupport.supportGroups.join(", ")}`,
                `Language Classes Free: ${city.immigrationSupport.languageClassesFree ? "Yes" : "No"}`,
                `Languages: ${city.communityIntegration.languages.join(", ")}`,
                `Cultural Centers: ${city.communityIntegration.culturalCenters.join(", ")}`,
                `Newcomer Services: ${city.communityIntegration.newcomerServices.join(", ")}`,
              ]
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
