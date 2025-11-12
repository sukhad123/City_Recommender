"use server"
{/**Get City Information */}
import { getCityCache } from "../../../repositories/CityDetails";
export default async function getCityInfo(cityName) {
    //TODO: Implement the logic to get city information
    const cityData = await getCityCache(cityName);
    return cityData;
};