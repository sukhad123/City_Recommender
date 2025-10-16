"use server"
{
  /**Pass any city as a params and get the city information */
}
import callOpenAIChat from "../../../libs/opeai/helper/callOpenAIChat.js";
//Idea: serper scrape wikipedia
//Call lllm to extract the information
//System Prompt
const system_prompt=   `You are a helpful assistant that extracts detailed information FOR THE CITY
and returns it as JSON in the following format:
Sample JSON:
{
  "city": "Toronto",
  "province": "ON",
  "imageKey": null,
  "gallery": [],
  "jobOpportunities": {
    "topIndustries": ["Tech", "Healthcare", "Education"],
    "growingSectors": ["AI", "Green Energy"],
    "demandByField": { "tech": 8.5, "healthcare": 7.5, "finance": 7.0 }
  },
  "costOfLiving": {
    "singleMonthly": 2200,
    "familyMonthly": 4800,
    "breakdown": { "housing": 1300, "food": 450, "transit": 150 },
    "currency": "CAD"
  },
  "weather": {
    "avgTemp": { "winterC": -6, "summerC": 22 },
    "snowfallCm": 110,
    "rainfallMm": 800
  },
  "rent": { "oneBed": 2000, "twoBed": 2600, "basement": 1500, "shared": 900 },
  "realEstate": { "avgPrice": 850000, "trend": "stable", "buyVsRent": "depends" },
  "qualityOfLife": {
    "score": 7.8,
    "components": { "greenSpace": 8.2, "safety": 7.2, "commute": 6.9, "culture": 8.4 }
  },
  "education": {
    "schoolBoards": ["Public Board", "Catholic Board"],
    "universities": [{"name": "Toronto University"}],
    "colleges": [{"name": "Toronto College"}]
  },
  "healthcare": {
    "hospitals": [{"name": "General Hospital", "distanceKm": 3.5}],
    "clinicsCount": 75,
    "avgWaitDays": 6,
    "mentalHealthServices": true
  },
  "communityIntegration": {
    "culturalCenters": ["Community Centre"],
    "newcomerServices": ["Settlement Agency"],
    "languages": ["English", "French"]
  },
  "immigrationSupport": {
    "agencies": ["Local Settlement Org"],
    "languageClassesFree": true,
    "supportGroups": ["Newcomer Group"]
  },
  "safetyCrime": { "crimeIndex": 40, "policeStations": 10, "programs": ["Watch"] },
  "transportation": {
    "transit": ["Bus", "Light Rail"],
    "bikeLanesKm": 120,
    "walkScore": 70,
    "airports": ["YYZ"]
  },
  "internetTech": {
    "highSpeedAvailability": "98%",
    "typicalDownMbps": 400,
    "techJobsPresence": "medium"
  },
  "outdoorLifestyle": {
    "parks": 300,
    "majorParks": ["Central Park"],
    "gyms": 120,
    "restaurants": 900,
    "events": ["Food Fest"]
  },
  "demographics": {
    "population": 500000,
    "ageDistribution": { "0-14": 0.16, "15-64": 0.68, "65+": 0.16 },
    "diversityIndex": 0.72
  }
}`
export default async function getCityInformation(cityName)
{
  try{
    
    const response = await callOpenAIChat(cityName,system_prompt)
    let parsed;
    let data;

try {
  data = typeof response === "string" ? JSON.parse(response) : response;
  return data;
} catch (err) {
  console.warn("Failed to parse JSON, returning raw response");
  data = response; 
}

console.log("Parsed data:", data);

    return parsed;
    
  }
  catch(error){
    return error;
  }
}