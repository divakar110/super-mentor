import { NextResponse } from "next/server";
import { processUrl } from "@/lib/agent/ingestTools";
import { auth } from "@/auth";
import db from "@/lib/db";
import { processAndEmbedMaterial } from "@/lib/rag/ingest";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Run the Agent
        const data = await processUrl(url);

        if (!data) {
            return NextResponse.json({ error: "Failed to process URL" }, { status: 500 });
        }

        // Save to DB
        const material = await db.material.create({
            data: {
                title: data.title || "Untitled",
                subject: "General", // Default subject
                type: "web",
                url: url,
                content: data.content,
                userId: session.user.id
            }
        });

        // Trigger RAG Embedding (Background)
        // We await it here for simplicity, but could be background job.
        if (material.content) {
            await processAndEmbedMaterial(material.id, material.content);
        }

        return NextResponse.json({ success: true, material });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
