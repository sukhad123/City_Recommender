import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { s3Key } = req.body;

  // Delete from S3
  const s3 = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  try {
    if (s3Key) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: "user-profile-images-city-recommender",
          Key: s3Key,
        })
      );
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
}
