import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";
import { processAndEmbedMaterial } from "@/lib/rag/ingest";

// Helper for CORS headers
const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const materials = await db.material.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(materials);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const origin = req.headers.get("origin") || "";
        const headers = {
            ...corsHeaders,
            "Access-Control-Allow-Origin": origin,
        };

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        const body = await req.json();
        const { title, subject, type, content, url } = body;

        const material = await db.material.create({
            data: {
                title,
                subject,
                type,
                content: content || "",
                url: url || "",
                userId: session.user.id
            }
        });

        // Trigger Embedding
        if (content) {
            await processAndEmbedMaterial(material.id, content);
        }

        return NextResponse.json(material, { headers });

    } catch (error) {
        console.error("Create Material Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500, headers: corsHeaders });
    }
}
