"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import getRecommendation from "../../../services/core/recommendation/getRecommendation.js";
import JobFieldSelect from "./_components/JobFieldSelect";
import CostOfLiving from "./_components/CostOfLiving";
import RentalPriceInput from "./_components/RentalPriceInput";
import WeatherPrefSelect from "./_components/WeatherPrefSelect";
import ProvinceSelect from "./_components/ProvinceSelect";
import LifeStage from "./_components/LifeStage";
import LanguagePrefSelect from "./_components/LanguagePrefSelect";
import ImmigrationStatusSelect from "./_components/ImmigrationStatusSelect";
import RecommendationsModal from "./_components/RecommendationsModal";
import CitySizeSelect from "./_components/CitySizeSelect";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import {
  upsertUserPreferences,
  getUserPreferences,
  deleteUserPreferences, 
} from "../../../repositories/userPrefs";
import { getCityRecommendations } from "../../../repositories/recommendation";
import { saveCityRecommendations, getCityRecommendationsForUser, clearCityRecommendations } from "../../../repositories/cityRecommendations";

export default function UserPreferencesPage() {
  const auth = useAuthInfo();
  const userEmail = useMemo(() => auth?.email ?? auth?.user?.email ?? "", [auth]);

  const [jobField, setJobField] = useState("");
  const [costOfLiving, setCostOfLiving] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [weather, setWeather] = useState("");
  const [citySize, setCitySize] = useState("");
  const [province, setProvince] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [language, setLanguage] = useState("");
  const [immigrationStatus, setImmigrationStatus] = useState("");

  const [errors, setErrors] = useState({});
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);        
  const [hasPrefs, setHasPrefs] = useState(false);       
  const [recModalOpen, setRecModalOpen] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const clearForm = () => {
    setJobField("");
    setCostOfLiving("");
    setRentalPrice("");
    setWeather("");
    setCitySize("");
    setProvince("");
    setLifeStage("");
    setLanguage("");
    setImmigrationStatus("");
    setErrors({});
  };

  useEffect(() => {
    if (!userEmail) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingPrefs(true);
        const prefs = await getUserPreferences(userEmail);
        if (!prefs || cancelled) {
          setHasPrefs(false);
          return;
        }
        setJobField(prefs.jobField ?? "");
        setCostOfLiving(prefs.costOfLiving ?? "");
        setRentalPrice(typeof prefs.rentalPrice === "number" ? String(prefs.rentalPrice) : "");
        setWeather(prefs.weather ?? "");
        setCitySize(prefs.citySize ?? "");
        setProvince(prefs.province ?? "");
        setLifeStage(prefs.lifeStage ?? "");
        setLanguage(prefs.language ?? "");
        setImmigrationStatus(prefs.immigrationStatus ?? "");
        setHasPrefs(true);
      } catch (e) {
        console.error("Failed to load prefs:", e);
        setHasPrefs(false);
      } finally {
        if (!cancelled) setLoadingPrefs(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userEmail]);

  const onChangeClear = (setter, key) => (v) => {
    setter(v);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateAll = () => {
    const e = {};
    if (!jobField) e.jobField = "Select a job field.";
    if (rentalPrice === "") e.rentalPrice = "Enter your monthly rental budget.";
    else if (isNaN(Number(rentalPrice))) e.rentalPrice = "Must be a number.";
    else if (Number(rentalPrice) < 0) e.rentalPrice = "Cannot be negative.";
    if (!costOfLiving) e.costOfLiving = "Choose a cost of living.";
    if (!weather) e.weather = "Choose a weather preference.";
    if (!citySize) e.citySize = "Choose a city size.";
    if (!lifeStage) e.lifeStage = "Choose your life stage.";
    if (!language) e.language = "Choose a language preference.";
    if (!immigrationStatus) e.immigrationStatus = "Choose immigration status.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      setResultMsg("You must be signed in to save preferences.");
      setRecModalOpen(true);
      return;
    }
    if (!validateAll()) return;

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
      city_size: (citySize || "medium").toLowerCase(),
    };

    try {
      setSubmitting(true);
      await upsertUserPreferences(userEmail, dbPayload);
      setHasPrefs(true);

      const recs = await getRecommendation(flaskPayload);
      alert("Preferences saved. See recommended cities based on your preferences.", recs);
      const ranked = recs || [];

      await saveCityRecommendations(userEmail, ranked);
      const saved = await getCityRecommendationsForUser(userEmail);

      setRecommendations(saved);
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

  const handleDelete = async () => {
    if (!userEmail) return;
    try {
      setDeleting(true);
      await deleteUserPreferences(userEmail);
      clearForm();
      setHasPrefs(false);
      setResultMsg("Preferences deleted.");
      setRecModalOpen(true);
    } catch (err) {
      console.error(err);
      setResultMsg(`Delete failed: ${err?.message ?? "Unknown error"}`);
      setRecModalOpen(true);
    } finally {
      setDeleting(false);
    }
  };

  if (!userEmail) {
    return <div className="p-4 text-sm opacity-80">Loading your account…</div>;
  }

  return (
    <>
      <div className="flex justify-center items-start min-h-screen py-8">
        <div className="w-full max-w-2xl">
          <div className="shadow-lg rounded-2xl bg-gray-900">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
              <h2 className="text-2xl font-bold text-center text-white mb-2">User Preferences</h2>

              <div className="flex flex-col">
                <JobFieldSelect
                  value={jobField}
                  onChange={onChangeClear(setJobField, "jobField")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.jobField ? <p className="text-sm text-danger mt-1">{errors.jobField}</p> : null}
              </div>

              <div className="flex flex-col">
                <CostOfLiving
                  value={costOfLiving}
                  onChange={onChangeClear(setCostOfLiving, "costOfLiving")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.costOfLiving ? <p className="text-sm text-danger mt-1">{errors.costOfLiving}</p> : null}
              </div>

              <div className="flex flex-col">
                <RentalPriceInput
                  value={rentalPrice}
                  onChange={onChangeClear(setRentalPrice, "rentalPrice")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.rentalPrice ? <p className="text-sm text-danger mt-1">{errors.rentalPrice}</p> : null}
              </div>

              <div className="flex flex-col">
                <WeatherPrefSelect
                  value={weather}
                  onChange={onChangeClear(setWeather, "weather")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.weather ? <p className="text-sm text-danger mt-1">{errors.weather}</p> : null}
              </div>

              <div className="flex flex-col">
                <CitySizeSelect
                  value={citySize}
                  onChange={onChangeClear(setCitySize, "citySize")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.citySize ? <p className="text-sm text-danger mt-1">{errors.citySize}</p> : null}
              </div>

              <div className="flex flex-col">
                <ProvinceSelect
                  value={province}
                  onChange={onChangeClear(setProvince, "province")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.province ? <p className="text-sm text-danger mt-1">{errors.province}</p> : null}
              </div>

              <div className="flex flex-col">
                <LifeStage
                  value={lifeStage}
                  onChange={onChangeClear(setLifeStage, "lifeStage")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.lifeStage ? <p className="text-sm text-danger mt-1">{errors.lifeStage}</p> : null}
              </div>

              <div className="flex flex-col">
                <LanguagePrefSelect
                  value={language}
                  onChange={onChangeClear(setLanguage, "language")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.language ? <p className="text-sm text-danger mt-1">{errors.language}</p> : null}
              </div>

              <div className="flex flex-col">
                <ImmigrationStatusSelect
                  value={immigrationStatus}
                  onChange={onChangeClear(setImmigrationStatus, "immigrationStatus")}
                  isDisabled={loadingPrefs || submitting || deleting}
                />
                {errors.immigrationStatus ? <p className="text-sm text-danger mt-1">{errors.immigrationStatus}</p> : null}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" color="primary" isLoading={submitting} isDisabled={loadingPrefs || deleting}>
                  {submitting ? "Saving..." : loadingPrefs ? "Loading..." : "Submit"}
                </Button>
                {hasPrefs ? (
                  <Button
                    type="button"
                    color="danger"
                    variant="flat"
                    onPress={handleDelete}
                    isLoading={deleting}
                    isDisabled={loadingPrefs || submitting}
                  >
                    {deleting ? "Deleting..." : "Delete Preferences"}
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
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
