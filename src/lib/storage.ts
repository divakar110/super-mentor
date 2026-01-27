import { Storage } from "@google-cloud/storage";

// Initialize storage client
// It will automatically look for GOOGLE_APPLICATION_CREDENTIALS or use provided keys
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix newlines in env var
    },
});

const bucketName = process.env.GCP_STORAGE_BUCKET_NAME || "antigravity-uploads";

export async function uploadFileToGCS(file: File | Buffer, filename: string, contentType: string = "application/pdf"): Promise<string> {
    try {
        const bucket = storage.bucket(bucketName);
        const gcsFileName = `uploads/${Date.now()}-${filename}`;
        const fileUpload = bucket.file(gcsFileName);

        let buffer: Buffer;
        if (Buffer.isBuffer(file)) {
            buffer = file;
        } else {
            // Convert File to Buffer
            const arrayBuffer = await (file as File).arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        }

        await fileUpload.save(buffer, {
            metadata: {
                contentType: contentType,
            },
        });

        console.log(`File uploaded to GCS: ${gcsFileName}`);

        // Make the file public (optional, depending on requirements)
        // await fileUpload.makePublic();

        // Return the public URL or authenticated URL
        // Public URL format: https://storage.googleapis.com/BUCKET_NAME/FILE_NAME
        return `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
    } catch (error) {
        console.error("GCS Upload Error:", error);
        throw new Error("Failed to upload file to Google Cloud Storage");
    }
}
