import { NextResponse } from "next/server";
import { generateQuizFromText } from "@/lib/agent/quizGenerator";
const pdf = require("pdf-parse");

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const textInput = formData.get("text") as string;
        const file = formData.get("file") as File;

        let finalText = "";
        let imageData = undefined;

        if (file) {
            console.log("Processing file:", file.name, file.type);
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            if (file.type === "application/pdf") {
                const data = await pdf(buffer);
                finalText = data.text;
            } else if (file.type.startsWith("image/")) {
                // Handle Image
                imageData = {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: file.type
                    }
                };
            }
        } else if (textInput) {
            finalText = textInput;
        }

        if ((!finalText || finalText.length < 50) && !imageData) {
            return NextResponse.json({ error: "Please provide valid content (text, PDF, or Image) to generate a quiz." }, { status: 400 });
        }

        const quizData = await generateQuizFromText(finalText, imageData);

        if (!quizData) {
            return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
        }

        return NextResponse.json(quizData);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
