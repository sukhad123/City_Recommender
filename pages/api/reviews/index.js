import { getReviewsByUserEmail } from "../../../src/repositories/review";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { userEmail } = req.query;
  if (!userEmail)
    return res.status(400).json({ error: "Missing userEmail query param" });
  try {
    const reviews = await getReviewsByUserEmail(userEmail);
    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}