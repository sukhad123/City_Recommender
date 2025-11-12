import { updateReview, deleteReview } from "../../../src/repositories/review";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing review id" });

  if (req.method === "PUT") {
    const { comment, city } = req.body;
    if (!comment || !city)
      return res.status(400).json({ error: "Missing comment or city" });
    try {
      const updated = await updateReview(id, { comment, city });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await deleteReview(id);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}