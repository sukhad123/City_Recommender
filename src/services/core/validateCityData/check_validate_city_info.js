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
    for(const city of cities)
    {
        //Try/Catch to Handle all edge cases
        try{
        //Step 2: Extract the City Data
        const city_data = await getCityCache(city);
        //Step 3: Verify the data
        if(!city_data.city)
        {
           //For non existing datas
           const new_data = await getCityInformation(city);
           //Update the new data in database
           const data = update_city_cache(city,new_data.data);
           console.log("Data Updated Successfully");

        }
        }
        catch(err)
        {
            console.log(err);
        }
        



    }


}