import { serve } from "inngest/next";
import { inngest } from "./client";
import { validate_update_cityData } from "./function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    validate_update_cityData, 
  ],
});