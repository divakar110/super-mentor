import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        // --- RAG implementation ---
        // 1. Read materials
        const dataFilePath = path.join(process.cwd(), "src/data/materials.json");
        let knowledgeBase = "";

        try {
            if (fs.existsSync(dataFilePath)) {
                const fileContent = fs.readFileSync(dataFilePath, "utf8");
                const materials = JSON.parse(fileContent);

                // 2. Extract content
                knowledgeBase = materials
                    .filter((m: any) => m.content)
                    .map((m: any) => `[Title: ${m.title}]\n${m.content}`)
                    .join("\n\n");
            }
        } catch (err) {
            console.error("Failed to read knowledge base", err);
        }

        const systemInstruction = knowledgeBase
            ? `You are an AI Mentor. Access to Study Notes:\n${knowledgeBase}\n\nUse these notes to answer the student's questions if relevant.`
            : "You are an AI Mentor.";

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemInstruction
        });

        // Format history for Gemini
        // Gemini expects parts array with text
        // IMPORTANT: History must start with 'user', so we filter out initial assistant messages if they exist
        let history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        while (history.length > 0 && history[0].role === "model") {
            history.shift();
        }

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
