import { Review } from "../../../db"

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  try {
    const query = {};
    if (city) query.city = city;

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    return Response.json({ reviews }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch reviews", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { comment, city, rating, userId } = await request.json();
    const review = await Review.create({ comment, city, rating, user: userId });
    return Response.json(review, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Failed to create review" }, { status: 400 });
  }
}
