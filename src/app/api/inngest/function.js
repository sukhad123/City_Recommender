import { inngest } from "./client";
import validate_update_city_info from "../../../services/core/validateCityData/check_validate_city_info"


//validate_update_city
export const validate_update_cityData = inngest.createFunction(
  { id: "validate_updateCityData" },
  { event: "cityData/validate_updateCityData" },
  //Cron job runs everyday at 2AM
  { cron: "TZ=America/New_York 0 2 * * *" },
  async () => {
    return await validate_update_city_info();
  },
);

//Test cron job
export const testFunction= inngest.createFunction(
  { id: "activation-email" },
  { event: "app/test" },
  async ({ event, step }) => {
    await step.run("send-welcome-email", async () => {
     return;
    });
  }
);