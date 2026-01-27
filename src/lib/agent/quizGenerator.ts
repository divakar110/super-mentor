import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Groq Setup
// Groq Setup (Safe for Build)
const groqKey = process.env.GROQ_API_KEY || "dummy_key_for_build";
const groq = new Groq({
    apiKey: groqKey,
    dangerouslyAllowBrowser: true // if needed, but usually server side
});

// Prompt Template
const SYSTEM_PROMPT = `
You are an expert exam setter.
Analyze the provided study material and generate a high-quality Multiple Choice Quiz (MCQ).

Task:
1. Identify the main topics covered.
2. Create 3-5 distinct questions PER TOPIC.
3. For each question provide:
   - A clear question stem.
   - 4 plausible options.
   - The correct option index (0-3).
   - A detailed explanation of why the answer is correct.

Return strictly Valid JSON in this format:
{
    "topics": [
        {
            "name": "Topic Name",
            "questions": [
                {
                    "id": 1, 
                    "question": "Question text?",
                    "options": ["A", "B", "C", "D"],
                    "correct": 0,
                    "explanation": "Because..."
                }
            ]
        }
    ]
}
`;

export async function generateQuizFromText(text: string, imageData?: { inlineData: { data: string, mimeType: string } }) {
    try {
        console.log("Generating Quiz...");

        // --- STRATEGY SELECTION ---

        // 1. If Image is present, MUST use Gemini (Groq Llama 3 is text-only usually)
        if (imageData) {
            console.log("Strategy: Multimodal (Gemini)");
            return await generateWithGemini(text, imageData);
        }

        // 2. If Text is present and we have Groq Key, use Groq (Faster)
        if (process.env.GROQ_API_KEY) {
            console.log("Strategy: Fast Text (Groq Llama 3)");
            return await generateWithGroq(text);
        }

        // 3. Fallback to Gemini
        console.log("Strategy: FallbackText (Gemini)");
        return await generateWithGemini(text);

    } catch (error) {
        console.error("Quiz Gen Error:", error);
        return null;
    }
}

async function generateWithGroq(text: string) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT + "\n IMPORTANT: Return ONLY JSON. No markdown." },
                { role: "user", content: `Study Material:\n"${text.substring(0, 30000)}"` }
            ],
            model: "llama3-70b-8192", // High speed, good reasoning
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const jsonString = completion.choices[0]?.message?.content || "{}";
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Groq Failed, falling back to Gemini...", e);
        return await generateWithGemini(text); // Fallback
    }
}

async function generateWithGemini(text: string, imageData?: any) {
    try {
        const promptParts: any[] = [];

        promptParts.push(SYSTEM_PROMPT);
        if (text) promptParts.push(`Content:\n"${text.substring(0, 50000)}..."`);
        if (imageData) promptParts.push(imageData);

        const result = await geminiModel.generateContent(promptParts);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanedJson);
    } catch (e) {
        console.error("Gemini Failed:", e);
        return null;
    }
}
