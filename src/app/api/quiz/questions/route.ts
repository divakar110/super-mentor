import { NextResponse } from "next/server";
import db from "@/lib/db";

const prisma = db;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!topicId) {
        return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    try {
        const questions = await prisma.question.findMany({
            where: { topicId },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'asc' } // Or random? Static usually implies ordered.
        });

        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }
}
