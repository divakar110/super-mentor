import { NextResponse } from "next/server";
import { processBulkPdf } from "@/lib/agent/bulkIngest";
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
        const result = await processBulkPdf(text, file.name);

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
