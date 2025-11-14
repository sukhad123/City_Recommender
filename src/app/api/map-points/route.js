import { NextResponse } from "next/server";
import { getUserMapPointsByEmail } from "../../../repositories/mapPoints";

export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log("Incoming email:", email);

    const points = await getUserMapPointsByEmail(email);
    console.log("Points to return:", points);

    return NextResponse.json({ points });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ points: [] });
  }
}