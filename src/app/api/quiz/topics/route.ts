import { NextResponse } from "next/server";
import db from "@/lib/db";

const prisma = db;

export async function GET() {
    try {
        const topics = await prisma.topic.findMany({
            include: {
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(topics);
    } catch (error) {
        console.error("Topics API Error:", error);
        return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
    }
}
