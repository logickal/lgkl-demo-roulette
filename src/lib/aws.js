import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import 'dotenv/config';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export async function getAllMp3Urls() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
    });

    try {
        const data = await s3Client.send(command);
        return data.Contents
            .filter(obj => obj.Key.endsWith('.mp3'))
            .map(obj => `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`);
    } catch (error) {
        console.error("Error fetching from S3:", error);
        return [];
    }
}
