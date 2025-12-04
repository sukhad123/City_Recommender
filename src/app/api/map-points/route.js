import { NextResponse } from "next/server";
import { getMapPoints } from "../../../repositories/mapPoints";

export async function POST(req) {
  try {

    const points = await getMapPoints();
   

    return NextResponse.json({ points });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ points: [] });
  }
}