"use server"
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
  /**Sukhad need to define prompt for our use case */
}
const system_prompt = `You are a helpful assistant that helps people find the best city to live in Canada based on their preferences. 
You will be provided with the user's preferences, and you need to suggest the top 3 cities in Canada that best match those preferences by analyzing the data provided. 
Use the following criteria to make your recommendations:
1. Job Opportunities: Consider the user's job field and suggest cities with strong job markets in that field.
2. Cost of Living: Take into account the user's budget and cost of living preference to recommend cities that are affordable.
3. Weather: Factor in the user's weather preference to suggest cities with a climate that suits them.
4. City Size: Recommend cities that match the user's preferred city size (small, medium, large).
5. Province: If the user has a province preference, prioritize cities within that province.
6. Life Stage: Consider the user's life stage (e.g., student, young professional, family) to suggest cities that cater to their needs.
7. Language: Take into account the user's language preference to recommend cities where that language is commonly spoken.  

Always return your output in json format as shown below:
only response the cities name in json only**********************8
Sample output format:
{
  "recommended_cities": ["Toronto", "Vancouver", "Montreal"]}`;
export default async function getRecommendation(userData) {
  try {
    const res = await callOpenAIChat(JSON.stringify(userData), system_prompt);
    return res;
  } catch (error) {
    return { error: error.message };
  }
}
