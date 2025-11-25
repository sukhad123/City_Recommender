import { inngest } from "./client";
import validate_update_city_info from "../../../services/core/validateCityData/check_validate_city_info"

export const validate_update_cityData = inngest.createFunction(
  { id: "validate_updateCityData" },
  { event: "cityData/validate_updateCityData" },
  //Cron job runs everyday at 2AM
  { cron: "TZ=America/New_York 0 2 * * *" },
  async () => {
    return await validate_update_city_info();
  },
);