import { getCityLastUpdateAt } from "../../../repositories/CityDetails";

export default async function getCityLastUpdatedAt(cityName) {
    //TODO: Implement the logic to get city information
    const cityData = await getCityLastUpdateAt(cityName);
    return cityData;
};