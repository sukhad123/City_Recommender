"use server";

export async function getCityRecommendations(payload) {
  try {
    const res = await fetch(`${process.env.FLASK_URL}/recommend`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.FLASK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Flask API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error calling Flask API:", err);
    throw err;
  }
}
