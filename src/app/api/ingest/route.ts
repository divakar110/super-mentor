import { NextResponse } from "next/server";
import { processUrl } from "@/lib/agent/ingestTools";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Run the Agent
        const data = await processUrl(url);

        if (!data) {
            return NextResponse.json({ error: "Failed to process URL" }, { status: 500 });
        }

        // Save to materials.json
        const filePath = path.join(process.cwd(), "src/data/materials.json");
        let materials = [];

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf8");
            materials = JSON.parse(fileContent);
        }

        const newMaterial = {
            id: Date.now().toString(),
            type: "web",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            url: url,
            ...data
        };

        materials.push(newMaterial);
        fs.writeFileSync(filePath, JSON.stringify(materials, null, 4));

        return NextResponse.json({ success: true, material: newMaterial });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
