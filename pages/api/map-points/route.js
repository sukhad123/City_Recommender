import { NextResponse } from "next/server";
import { getUserMapPointsByEmail } from "../../../repositories/mapPoints";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ points: [] }, { status: 200 });

    const points = await getUserMapPointsByEmail(email); // Prisma on server
    return NextResponse.json({ points });
  } catch (e) {
    console.error("POST /api/map-points error", e);
    return NextResponse.json({ points: [] }, { status: 200 });
  }
}
