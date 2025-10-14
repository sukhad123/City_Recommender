// pages/api/upload-profile-image.js
import formidable from "formidable";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Formidable error", err);
            return res.status(500).json({ error: "Error parsing" });
        }
        let file = files.file;
        if (Array.isArray(file)) {
            file = file[0];
        }
        const mimetype = file.mimetype || file.type;
        const allowedTypes = ["image/jpeg", "image/png"];

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        if (!mimetype || !allowedTypes.includes(mimetype)) {
            return res.status(400).json({ error: "Invalid file type or size" });
        }
        if (file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ error: "Invalid file size" });
        }
        const fileStream = fs.createReadStream(file.filepath);
        const s3 = new S3Client({
            region: "us-east-2",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        const s3Key = `profile-images/${fields.email}-${Date.now()}`;
        await s3.send(new PutObjectCommand({
            Bucket: "user-profile-images-city-recommender",
            Key: s3Key,
            Body: fileStream,
            ContentType: mimetype,
        }));
        //const s3Url = `https://user-profile-images-city-recommender.s3.us-east-2.amazonaws.com/${s3Key}`;
        res.status(200).json({ url: s3Key });
    });
}
