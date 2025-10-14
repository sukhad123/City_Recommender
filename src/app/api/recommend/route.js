import { NextResponse } from "next/server";

const FLASK_URL = process.env.FLASK_URL; 
const API_KEY = process.env.FLASK_API_KEY;

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${FLASK_URL}/recommend`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
   
    return new NextResponse(text, { status: res.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Proxy error", detail: String(err) }, { status: 500 });
  }
}
