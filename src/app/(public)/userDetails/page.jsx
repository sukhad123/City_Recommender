"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import JobFieldSelect from "./_components/JobFieldSelect";
import CostOfLiving from "./_components/CostOfLiving";
import RentalPriceInput from "./_components/RentalPriceInput";
import WeatherPrefSelect from "./_components/WeatherPrefSelect";
import ProvinceSelect from "./_components/ProvinceSelect";
import LifeStage from "./_components/LifeStage";
import LanguagePrefSelect from "./_components/LanguagePrefSelect";
import ImmigrationStatusSelect from "./_components/ImmigrationStatusSelect";
import MissingFieldsModal from "./_components/MissingFieldsModal";
import RecommendationsModal from "./_components/RecommendationsModal";
import CitySizeSelect from "./_components/CitySizeSelect";

import { upsertUserPreferences } from "../../../repositories/userPrefs";
import { getCityRecommendations } from "../../../repositories/recommendation";

export default function UserDetailsPage() {
  const userEmail = "user@example.com";

  const [jobField, setJobField] = useState("");
  const [costOfLiving, setCostOfLiving] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [weather, setWeather] = useState("");
  const [citySize, setCitySize] = useState("");
  const [province, setProvince] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [language, setLanguage] = useState("");
  const [immigrationStatus, setImmigrationStatus] = useState("");

  const [rentalError, setRentalError] = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [showMissingModal, setShowMissingModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [recModalOpen, setRecModalOpen] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const validateRental = () => {
    let err = "";
    if (rentalPrice !== "" && isNaN(rentalPrice)) err = "Must be a number.";
    else if (rentalPrice !== "" && Number(rentalPrice) < 0) err = "Cannot be negative.";
    setRentalError(err);
    return !err;
  };

  const validateRequireds = () => {
    const missing = [];
    if (!jobField) missing.push("Job field");
    if (!rentalPrice) missing.push("Rental budget");
    if (!costOfLiving) missing.push("Cost of living");
    if (!weather) missing.push("Weather preference");
    if (!citySize) missing.push("City size preference");
    if (!lifeStage) missing.push("Life stage / situation");
    if (!language) missing.push("Language preference");
    if (!immigrationStatus) missing.push("Immigration status");
    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rentalOk = validateRental();
    const requiredOk = validateRequireds();
    if (!requiredOk) setShowMissingModal(true);
    if (!rentalOk || !requiredOk) return;

    const dbPayload = {
      jobField,
      costOfLiving,
      rentalPrice: rentalPrice === "" ? null : Number(rentalPrice),
      weather,
      province: province || null,
      lifeStage,
      language,
      immigrationStatus,
      citySize,
    };

    const flaskPayload = {
      job_field: jobField,
      budget: rentalPrice === "" ? null : Number(rentalPrice),
      cost_of_living: costOfLiving.toLowerCase(),
      weather: weather.toLowerCase(),
      life_stage: lifeStage.toLowerCase(),
      language: language.toLowerCase(),
      immigration_status: immigrationStatus === "PR" ? "pr" : immigrationStatus.toLowerCase(),
      preferred_province: province || "any",
      city_size: citySize.toLowerCase() || "medium",
    };

    try {
      setSubmitting(true);
      // optional: persist preferences
      // await upsertUserPreferences(userEmail, dbPayload);

      const recs = await getCityRecommendations(flaskPayload);
      setRecommendations(recs.ranked_cities || []);
      setResultMsg("Preferences saved successfully");
      setRecModalOpen(true);
    } catch (err) {
      console.error(err);
      setRecommendations([]);
      setResultMsg(`Failed: ${err?.message ?? "Unknown error"}`);
      setRecModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 max-w-md">
        <JobFieldSelect value={jobField} onChange={setJobField} />
        <CostOfLiving value={costOfLiving} onChange={setCostOfLiving} />
        <RentalPriceInput value={rentalPrice} onChange={setRentalPrice} error={rentalError} />
        <WeatherPrefSelect value={weather} onChange={setWeather} />
        <CitySizeSelect value={citySize} onChange={setCitySize} />
        <ProvinceSelect value={province} onChange={setProvince} />
        <LifeStage value={lifeStage} onChange={setLifeStage} />
        <LanguagePrefSelect value={language} onChange={setLanguage} />
        <ImmigrationStatusSelect value={immigrationStatus} onChange={setImmigrationStatus} />

        <Button type="submit" color="primary" isLoading={submitting}>
          {submitting ? "Saving..." : "Submit"}
        </Button>
      </form>

      {/* Modals */}
      <MissingFieldsModal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        fields={missingFields}
      />

      <RecommendationsModal
        isOpen={recModalOpen}
        onClose={() => setRecModalOpen(false)}
        message={resultMsg}
        recommendations={recommendations}
        limit={5}
      />
    </>
  );
}
