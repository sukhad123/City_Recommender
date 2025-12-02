// src/app/(private)/city/[name]/page.jsx
"use client";

import  SelectCity  from "./_components/select";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

import LoadingSpinner from "../../../components/ui/spinner";
import getCityInformation from "../../../../services/core/cityInformation/retrieve_cityInformation";
import getCityInfo from "../../../../services/core/cityInformation/getCityInfo";

// env for your CDN/S3 base (optional)
/** Build an image URL using S3/CDN if imageKey exists, else Unsplash fallback 
function resolveHeroImage(city, province, imageKey) {
  if (CDN_BASE && imageKey) return `${CDN_BASE}/${imageKey}`;
  const display = city?.replace(/_/g, " ") || "Canada";
  return `https://source.unsplash.com/featured/?${encodeURIComponent(
    `${display} ${province || "Canada"}`
  )}`;
}*/
import CityComparePage from "./_components/compare";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
// UI components
import CityHeader from "./_components/CityHeader";
import InfoSection from "./_components/InfoSection";
import KeyValueList from "./_components/KeyValueList";
import PillList from "./_components/PillList";
import { getCityLastUpdatedAt } from "../../../../repositories/CityDetails";
 
export default function CityInfoPage() {

  //Fetch the city data async from the data once the page loads
  const params = useParams();
  const searchParams = useSearchParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
 const[city, setCity] = useState("");
  const[showCompare, setShowCompare] = useState(false);
  const [cityDate, setCityDate] = useState(null);

  const handleLoadToNewPage = () => {

  };

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract city name from params
        const rawParam = Array.isArray(params?.name) ? params.name[0] : params?.name;
        const cityName = decodeURIComponent(rawParam || "").replace(/_/g, " ");
        const province = searchParams?.get('province') || undefined;
        setCity(cityName);
        console.log("City name:", cityName);

        // Try to get city information from the new service first
        console.log("Fetching city information for:", cityName);
        const cityInfo = await getCityInfo(cityName);
        const cityLastUpdatedAt = await getCityLastUpdatedAt(cityName);
        setCityDate(cityLastUpdatedAt)
        setDetails(cityInfo);
        setLoading(false);

        console.log("City info received:", cityInfo);
        
    
      } catch (error) {
        console.error("Error fetching city information:", error);
        
        
        // Fallback to DB or placeholders
      
      } 
    };

    fetchCityData();
  }, [params, searchParams]);

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error state if needed
  if (error && !details) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">Error Loading City Data</h1>
          <p className="text-default-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">City Not Found</h1>
          <p className="text-default-500">Unable to load city information.</p>
        </div>
      </div>
    );
  }
 


  const jobs = details.jobOpportunities || {};
  const col = details.costOfLiving || {};
  const weather = details.weather || {};
  const rent = details.rent || {};
  const realEstate = details.realEstate || {};
  const qol = details.qualityOfLife || {};
  const edu = details.education || {};
  const health = details.healthcare || {};
  const community = details.communityIntegration || {};
  const immigration = details.immigrationSupport || {};
  const safety = details.safetyCrime || {};
  const transit = details.transportation || {};
  const net = details.internetTech || {};
  const lifestyle = details.outdoorLifestyle || {};
  const demo = details.demographics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/**Compare with other cities */}
       <Button onPress={onOpen}>Compare with Other Cities</Button>
      <Modal  isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex  flex-col gap-1">City Comparison Feature</ModalHeader>
              <ModalBody className="w-full">
        <SelectCity initialCity={city}  />
 
    {/**Once Selection load the comparision */}
               
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Job Opportunities */}
      <InfoSection title="Job Opportunities" subtitle="Industries & demand">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Top Industries</h4>
            <PillList items={jobs.topIndustries || []} />
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Growing Sectors</h4>
            <PillList items={jobs.growingSectors || []} />
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-foreground">Demand by Field (0–10)</h4>
          <KeyValueList
            items={Object.entries(jobs.demandByField || {}).map(([k, v]) => ({
              label: k,
              value: String(v),
            }))}
          />
        </div>
      </InfoSection>

      {/* Cost of Living */}
      <InfoSection title="Cost of Living" subtitle="Monthly estimates">
        <KeyValueList
          items={[
            col.singleMonthly != null && {
              label: "Single (monthly)",
              value: formatCurrency(col.singleMonthly),
            },
            col.familyMonthly != null && {
              label: "Family (monthly)",
              value: formatCurrency(col.familyMonthly),
            },
          ].filter(Boolean)}
        />
        {col.breakdown && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-foreground">Breakdown</h4>
            <KeyValueList
              items={Object.entries(col.breakdown).map(([k, v]) => ({
                label: k,
                value: formatCurrency(Number(v)),
              }))}
            />
          </div>
        )}
      </InfoSection>

      {/* Weather */}
      <InfoSection title="Weather">
        <KeyValueList
          items={[
            weather.avgTemp?.winterC != null && {
              label: "Avg Winter (°C)",
              value: String(weather.avgTemp.winterC),
            },
            weather.avgTemp?.summerC != null && {
              label: "Avg Summer (°C)",
              value: String(weather.avgTemp.summerC),
            },
            weather.snowfallCm != null && {
              label: "Snowfall (cm/yr)",
              value: String(weather.snowfallCm),
            },
            weather.rainfallMm != null && {
              label: "Rainfall (mm/yr)",
              value: String(weather.rainfallMm),
            },
          ].filter(Boolean)}
        />
      </InfoSection>

      {/* Rent */}
      <InfoSection title="Average Rent Prices">
        <KeyValueList
          items={[
            rent.oneBed != null && {
              label: "1-bed",
              value: formatCurrency(rent.oneBed),
            },
            rent.twoBed != null && {
              label: "2-bed",
              value: formatCurrency(rent.twoBed),
            },
            rent.basement != null && {
              label: "Basement",
              value: formatCurrency(rent.basement),
            },
            rent.shared != null && {
              label: "Shared",
              value: formatCurrency(rent.shared),
            },
          ].filter(Boolean)}
        />
      </InfoSection>

      {/* Real Estate */}
      <InfoSection title="Real Estate Outlook">
        <KeyValueList
          items={[
            realEstate.avgPrice != null && {
              label: "Avg House Price",
              value: formatCurrency(realEstate.avgPrice),
            },
            realEstate.trend && {
              label: "Market Trend",
              value: String(realEstate.trend),
            },
            realEstate.buyVsRent && {
              label: "Buying vs Renting",
              value: String(realEstate.buyVsRent),
            },
          ].filter(Boolean)}
        />
      </InfoSection>

      {/* Quality of Life */}
      <InfoSection title="Quality of Life">
        <KeyValueList
          items={[
            qol.score != null && {
              label: "Composite Score",
              value: String(qol.score),
            },
            ...(Object.entries(qol.components || {}).map(([k, v]) => ({
              label: k,
              value: String(v),
            })) || []),
          ]}
        />
      </InfoSection>

      {/* Education */}
      <InfoSection title="Education Facilities">
        {Array.isArray(edu.schoolBoards) && edu.schoolBoards.length > 0 && (
          <>
            <h4 className="font-semibold mb-2">School Boards</h4>
            <PillList items={edu.schoolBoards} />
          </>
        )}
        {(Array.isArray(edu.universities) && edu.universities.length > 0) ||
        (Array.isArray(edu.colleges) && edu.colleges.length > 0) ? (
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div>
              <h4 className="font-semibold mb-2">Universities</h4>
              <PillList items={edu.universities?.map((u) => u.name) || []} />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Colleges</h4>
              <PillList items={edu.colleges?.map((c) => c.name) || []} />
            </div>
          </div>
        ) : null}
      </InfoSection>

      {/* Healthcare */}
      <InfoSection title="Healthcare Access">
        <KeyValueList
          items={[
            health.clinicsCount != null && {
              label: "Clinics",
              value: String(health.clinicsCount),
            },
            health.avgWaitDays != null && {
              label: "Avg Wait (days)",
              value: String(health.avgWaitDays),
            },
            health.mentalHealthServices != null && {
              label: "Mental Health Services",
              value: health.mentalHealthServices ? "Yes" : "No",
            },
          ].filter(Boolean)}
        />
        {Array.isArray(health.hospitals) && health.hospitals.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Hospitals</h4>
            <KeyValueList
              items={health.hospitals.map((h) => ({
                label: h.name,
                value:
                  h.distanceKm != null ? `${h.distanceKm} km` : "distance n/a",
              }))}
            />
          </div>
        )}
      </InfoSection>

      {/* Community Integration */}
      <InfoSection title="Community Integration">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h4 className="font-semibold mb-2">Cultural Centers</h4>
            <PillList items={community.culturalCenters || []} />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Newcomer Services</h4>
            <PillList items={community.newcomerServices || []} />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Languages</h4>
            <PillList items={community.languages || []} />
          </div>
        </div>
      </InfoSection>

      {/* Immigration Support */}
      <InfoSection title="Immigration Support">
        <KeyValueList
          items={[
            immigration.languageClassesFree != null && {
              label: "Free Language Classes",
              value: immigration.languageClassesFree ? "Yes" : "No",
            },
          ].filter(Boolean)}
        />
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Agencies & Groups</h4>
          <PillList
            items={[
              ...(immigration.agencies || []),
              ...(immigration.supportGroups || []),
            ]}
          />
        </div>
      </InfoSection>

      {/* Safety */}
      <InfoSection title="Safety / Crime Rates">
        <KeyValueList
          items={[
            safety.crimeIndex != null && {
              label: "Crime Index",
              value: String(safety.crimeIndex),
            },
            safety.policeStations != null && {
              label: "Police Stations",
              value: String(safety.policeStations),
            },
          ].filter(Boolean)}
        />
        {Array.isArray(safety.programs) && safety.programs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Programs</h4>
            <PillList items={safety.programs} />
          </div>
        )}
      </InfoSection>

      {/* Transportation */}
      <InfoSection title="Transportation">
        <KeyValueList
          items={[
            transit.walkScore != null && {
              label: "Walk Score",
              value: String(transit.walkScore),
            },
            transit.bikeLanesKm != null && {
              label: "Bike Lanes (km)",
              value: String(transit.bikeLanesKm),
            },
            Array.isArray(transit.airports) &&
              transit.airports.length > 0 && {
                label: "Airports",
                value: transit.airports.join(", "),
              },
          ].filter(Boolean)}
        />
        {Array.isArray(transit.transit) && transit.transit.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Transit Options</h4>
            <PillList items={transit.transit} />
          </div>
        )}
      </InfoSection>

      {/* Internet & Tech */}
      <InfoSection title="Internet & Tech Access">
        <KeyValueList
          items={[
            net.highSpeedAvailability && {
              label: "High-speed Availability",
              value: String(net.highSpeedAvailability),
            },
            net.typicalDownMbps != null && {
              label: "Typical Down (Mbps)",
              value: String(net.typicalDownMbps),
            },
            net.techJobsPresence && {
              label: "Tech Jobs Presence",
              value: String(net.techJobsPresence),
            },
          ].filter(Boolean)}
        />
      </InfoSection>

      {/* Outdoor & Lifestyle */}
      <InfoSection title="Outdoor & Lifestyle">
        <KeyValueList
          items={[
            lifestyle.parks != null && {
              label: "Parks",
              value: String(lifestyle.parks),
            },
            Array.isArray(lifestyle.majorParks) &&
              lifestyle.majorParks.length > 0 && {
                label: "Major Parks",
                value: lifestyle.majorParks.join(", "),
              },
            lifestyle.gyms != null && {
              label: "Gyms",
              value: String(lifestyle.gyms),
            },
            lifestyle.restaurants != null && {
              label: "Restaurants",
              value: String(lifestyle.restaurants),
            },
          ].filter(Boolean)}
        />
        {Array.isArray(lifestyle.events) && lifestyle.events.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Events</h4>
            <PillList items={lifestyle.events} />
          </div>
        )}
      </InfoSection>

      {/* Demographics */}
      <InfoSection title="Demographics Snapshot">
        <KeyValueList
          items={[
            demo.population != null && {
              label: "Population",
              value: demo.population.toLocaleString(),
            },
            demo.diversityIndex != null && {
              label: "Diversity Index",
              value: String(demo.diversityIndex),
            },
          ].filter(Boolean)}
        />
        {demo.ageDistribution && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Age Distribution</h4>
            <KeyValueList
              items={Object.entries(demo.ageDistribution).map(([k, v]) => ({
                label: k,
                value: `${Math.round(Number(v) * 100)}%`,
              }))}
            />
          </div>
        )}
      </InfoSection>

      <div className="text-center py-4">
        <p className="text-xs text-default-400">
          Last updated:{" "}
          {cityDate
            ? new Date(cityDate).toLocaleDateString()
            : "Not Available"}
        </p>
      </div>
    </div>
  );
}

function formatCurrency(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}