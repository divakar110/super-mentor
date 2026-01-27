import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const materials = await db.material.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(materials);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, subject, type, content } = body;

        const newMaterial = await db.material.create({
            data: {
                title,
                subject,
                type,
                content,
                url: "#", // Placeholder
                userId: session.user.id,
            },
        });

        return NextResponse.json(newMaterial);
    } catch (error) {
        console.error("Material POST Error:", error);
        return NextResponse.json({ error: "Failed to save material" }, { status: 500 });
    }
}
