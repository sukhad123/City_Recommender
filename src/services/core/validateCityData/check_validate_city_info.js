"use server"
{/**This script is responsible to validate and update the city information */}
import {cities} from "../../../store/citie_server"
import {getCityCache} from "../../../repositories/CityDetails"
import getCityInformation from "../cityInformation/retrieve_cityInformation"
import { update_city_cache } from "../../../repositories/CityDetails" 
export default async function validate_update_city_info()
{
 
{/*
    Draft Idea for this service
    Loop through the cities in db
    Update the data whose information doesn't exists
    */}
    //Step 1: Loop through all Canadian Cities
   const tasks = cities.map(async (city) => {
    try {
        const city_data = await getCityCache(city);

        if (!city_data.city) {
            const new_data = await getCityInformation(city);
            await update_city_cache(city, new_data);
            console.log(`${city} updated`);
        }

    } catch (err) {
        console.error("Error for city:", city, err);
    }
});

await Promise.all(tasks);

}