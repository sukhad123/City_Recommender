import { NextResponse } from "next/server";
import {getMapPoints} from "../../../src/repositories/mapPoints"
export async function POST(req) {
  try {
    const points = await getMapPoints();
    return NextResponse.json({ points });
  } catch (e) {
    console.error("POST /api/map-points error", e);
    return NextResponse.json({ points: [] }, { status: 200 });
  }
}
