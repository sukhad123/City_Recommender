import { Review } from "../../../../db"
export async function GET(request, { params }) {
  try {
     const { id } = await params;
    const review = await Review.findById(id);
    if (!review) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(review);
  } catch (err) {
    return Response.json({ error: "Failed to fetch review" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const updated = await Review.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: "Failed to update review" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await Review.findByIdAndDelete(params.id);
    return Response.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
