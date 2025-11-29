import { inngest } from "./client";
import validate_update_city_info from "../../../services/core/validateCityData/check_validate_city_info"

export const validate_update_cityData = inngest.createFunction(
  { id: "validate_updateCityData" },
  [
    { event: "cityData/validate_updateCityData" },
    { cron: "TZ=America/New_York 0 2 * * *" },
  ],
  async ({ event, step }) => {
    return await validate_update_city_info();
  }
);