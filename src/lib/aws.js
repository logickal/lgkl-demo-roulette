import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import 'dotenv/config';
import path from 'path';

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
        let allMp3s = data.Contents
        .filter(obj => {
            const filename = path.basename(obj.Key);
            return filename.endsWith('.mp3') && !filename.startsWith('._');
        })
        .map(obj => `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`);
    
        return allMp3s;
    } catch (error) {
        console.error("Error fetching from S3:", error);
        return [];
    }
}
