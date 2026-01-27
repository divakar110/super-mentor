import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function processUrl(url: string) {
    try {
        console.log(`Fetching ${url}...`);
        const response = await fetch(url);
        const html = await response.text();

        // Simple HTML strip to get cleanish text
        const text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 30000); // 30k char limit for safety

        const prompt = `
        You are an educational content curator.
        Analyze the following text from a webpage:
        
        "${text}"
        
        Task:
        1. Identify the Main Subject (e.g., History, Physics, Coding).
        2. Create a Title.
        3. Create a detailed educational summary (content) suitable for study notes.
        
        Return JSON ONLY:
        {
            "subject": "Subject Name",
            "title": "Title Here",
            "content": "Full summary content here..."
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Clean markdown code blocks if present
        const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedJson);

    } catch (error) {
        console.error("Ingest Error:", error);
        return null;
    }
}
