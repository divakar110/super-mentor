import { NextResponse } from "next/server";
import { processBulkPdf } from "@/lib/agent/bulkIngest";
import { uploadFileToGCS } from "@/lib/storage";
// Polyfill for pdf-parse dependencies (pdfjs-dist based)
if (typeof DOMMatrix === "undefined") {
    (global as any).DOMMatrix = class DOMMatrix { };
}

const pdfLib = require("pdf-parse");
const PDFParse = pdfLib.PDFParse || pdfLib.default?.PDFParse;

export async function POST(req: Request) {
    console.log("Bulk Ingest Endpoint Hit");
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file || file.type !== "application/pdf") {
            return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Use PDFParse function/class
        console.log("Parsing PDF...");
        const data = await PDFParse(buffer);
        const text = data.text;

        if (text.length < 100) {
            return NextResponse.json({ error: "PDF seems empty or unreadable." }, { status: 400 });
        }

        // Trigger processing
        // Note: For very large files, this should ideally be a background job.
        // For this MVP, we await it, but we might hit Vercel timeouts if hosted.
        // On local/VPS it will just take time.
        let pdfUrl: string | undefined;
        try {
            console.log("Uploading to GCS...");
            // Use config or env check to decide if we should upload
            if (process.env.GCP_PROJECT_ID && process.env.GCP_STORAGE_BUCKET_NAME) {
                pdfUrl = await uploadFileToGCS(buffer, file.name);
                console.log("Uploaded PDF to:", pdfUrl);
            } else {
                console.log("Skipping GCS upload (missing config)");
            }
        } catch (uploadErr) {
            console.error("GCS Upload failed, continuing with processing only:", uploadErr);
            // We continue even if upload fails, or we could return error. 
            // For now, let's just log it so users still get their quiz.
        }

        const result = await processBulkPdf(text, file.name, pdfUrl);

        if (!result) {
            return NextResponse.json({ error: "Failed to process PDF." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            topic: result.topic,
            questionsAdded: result.count
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
