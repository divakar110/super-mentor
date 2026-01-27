import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/agent/planner";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { syllabus, days, hoursPerDay } = body;

        if (!syllabus || !days) {
            return NextResponse.json(
                { error: "Syllabus and Days are required" },
                { status: 400 }
            );
        }

        const plan = await generateStudyPlan({
            syllabus,
            days: Number(days),
            hoursPerDay: Number(hoursPerDay || 2)
        });

        if (!plan) {
            return NextResponse.json(
                { error: "Failed to generate plan. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(plan);

    } catch (error) {
        console.error("Planner API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
