import { get } from "http";
import callOpenAIChat from "../../../libs/opeai/helper/callOpenAIChat.js";
/**
 * Service to Get Recommendation-OPENAI LLM Zero shot approach
 *
 * @async
 * @function getRecommendation
 * @param {anyType[]} userData-array of data containing user details.
 * eg object
 * {
  "job_field": "tech",
  "budget": 1800,
  "cost_of_living": "medium",
  "weather_preference": "cold",
  "city_size": "medium",
  "province": "ON",
  "life_stage": "student",
  "language": "english",
  "immigration_status": "student_visa"
}
 * @returns {recommended Cities} - List of recommended cities
 */
{
  /**Sukhad need to define prompt for our specific use case */
}
const system_prompt = `You are a helpful assistant that helps people find the best city to live in Canada based on their preferences. You will be provided with the user's preferences, and you need to suggest the top 3 cities in Canada that best match those preferences. Provide a brief explanation for each city choice.`;
export default async function getRecommendation(userData) {
  try {
    const res = await callOpenAIChat(userData, system_prompt);
    return res;
  } catch (error) {
    return { error: error.message };
  }
}
