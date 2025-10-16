import callOpenAIChat from  "./src/libs/opeai/helper/callOpenAIChat.js";
import fetch from "node-fetch";

async function fetchTorontoHTML() {
  const url = "https://en.wikipedia.org/api/rest_v1/page/html/Toronto";

  // Fetch full page HTML
  const res = await fetch(url);
  const html = await res.text();

  // Send HTML to your OpenAI helper to extract structured JSON
  const summary = await callOpenAIChat(
    "toronto",
    `You are a helpful assistant that extracts detailed information crawl wikiepedia for the provided city from a Wikipedia page about a city and returns it as JSON in the following format:
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
  );

  // Optionally parse JSON if your helper returns a JSON string
  let parsedSummary;
  try {
    parsedSummary = JSON.parse(summary);
    console.log(parsedSummary);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    parsedSummary = summary; // fallback: raw string
  }

  return parsedSummary;
}

// Example usage
fetchTorontoHTML();
