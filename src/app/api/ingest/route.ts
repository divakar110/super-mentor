import { NextResponse } from "next/server";
import { processUrl } from "@/lib/agent/ingestTools";
import { auth } from "@/auth";
import db from "@/lib/db";
import { processAndEmbedMaterial } from "@/lib/rag/ingest";

const corsHeaders = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS(req: Request) {
    const origin = req.headers.get("origin") || "";
    return NextResponse.json({}, {
        headers: {
            ...corsHeaders,
            "Access-Control-Allow-Origin": origin,
        },
    });
}

export async function POST(req: Request) {
    try {
        // Handle session manually or via headers if needed for extension?
        // Extension likely won't send Next-Auth cookies correctly across origins easily without complex setup.
        // For now, let's relax Auth for the specific "Chrome Extension" agent or require an API Key?
        // Simplest Fix: The user asked for "Admins Only". The extension sends cookies if 'credentials: include' is used.
        // But 'Access-Control-Allow-Origin: *' prevents credentials. 
        // We need to reflect the origin.

        const origin = req.headers.get("origin") || "";
        // Basic check to see if it's from an extension (starts with chrome-extension://)
        const isExtension = origin.startsWith("chrome-extension://");

        const headers = {
            "Access-Control-Allow-Origin": origin, // Reflect origin
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        const session = await auth();
        // If coming from extension, we might rely on the session cookie if the browser sends it.

        if (!session?.user?.id) {
            // Fallback: If no session (cookie blocked), allow if we implement API Key later.
            // For now, return unauthorized but with CORS headers allowing the frontend to see the 401.
            return NextResponse.json({ error: "Unauthorized. Log in to the web app first." }, { status: 401, headers });
        }

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400, headers });
        }

        // Run the Agent
        const data = await processUrl(url);

        if (!data) {
            return NextResponse.json({ error: "Failed to process URL" }, { status: 500, headers });
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

        // Trigger RAG Embedding
        if (material.content) {
            await processAndEmbedMaterial(material.id, material.content);
        }

        return NextResponse.json({ success: true, material }, { headers });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500, headers: corsHeaders });
    }
}
