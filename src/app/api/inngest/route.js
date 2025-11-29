import { serve } from "inngest/next";
import { inngest } from "./client";
import { validate_update_cityData ,testFunction} from "./function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    validate_update_cityData, 
    testFunction
  ],
});