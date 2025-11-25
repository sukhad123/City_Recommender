{/**This service will store the recommendation */}
{/**Delete old recommendation store the new one */}
import { save_recommendation , delete_rec} from "../../../repositories/recommendations";
export default async function save_update_recommendation_service(userEmail,recommendedCities)
{
    //Step 1: Delete old one
    await delete_rec(userEmail);
    //Step 2: Update with the new recommended cities
    const save = await save_recommendation(recommendedCities, userEmail);
    return save;
}