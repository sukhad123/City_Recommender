// pages/api/get-profile-image-url.js
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { key } = req.query;

  const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
  const command = new GetObjectCommand({
    Bucket: "user-profile-images-city-recommender",
    Key: key,
  });
  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.status(200).json({ url: signedUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
