import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "@/lib/db";

const prisma = db;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to chunk text
function chunkText(text: string, chunkSize: number = 30000, overlap: number = 1000) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        chunks.push(text.substring(start, start + chunkSize));
        start += chunkSize - overlap;
    }
    return chunks;
}

export async function processBulkPdf(text: string, filename: string, pdfUrl?: string) {
    try {
        console.log(`Starting bulk processing for ${filename}. Length: ${text.length} chars`);

        // 1. Determine broadly what the TOPIC is from the first chunk
        const metaPrompt = `
        Analyze the start of this document: "${text.substring(0, 5000)}..."
        Identify the main subject/topic name (e.g. "Indian Polity", "Modern History", "Biology").
        Return only the Topic Name string.
        `;
        const topicResult = await model.generateContent(metaPrompt);
        let topicName = topicResult.response.text().trim().replace(/['"]/g, "");
        if (topicName.length > 50) topicName = "General Studies"; // Fallback if AI rambles

        // Create Topic in DB
        const topicSlug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
        const topic = await prisma.topic.upsert({
            where: { name: topicName },
            update: {
                sourceUrl: pdfUrl // Update URL if it exists
            },
            create: {
                name: topicName,
                slug: topicSlug,
                sourceUrl: pdfUrl
            }
        });

        console.log(`Identified Topic: ${topic.name}`);

        // 2. Process Chunks
        const chunks = chunkText(text);
        let totalQuestions = 0;

        for (const [i, chunk] of chunks.entries()) {
            console.log(`Processing chunk ${i + 1}/${chunks.length}...`);

            const prompt = `
            Extract all Multiple Choice Questions (MCQs) from the following text.
            Text: "..." (omitted for brevity, assume full chunk)
            
            Format: JSON Array of objects:
            [
              {
                "question": "Question text",
                "options": ["A", "B", "C", "D"],
                "correctIndex": 0, // 0-3
                "explanation": "Brief explanation if available"
              }
            ]
            
            Rules:
            - Ignore incomplete questions at start/end.
            - Ensure exactly 4 options.
            - If correct answer isn't clear, skip.
            - Return ONLY valid JSON.
            
            Content to Parse:
            "${chunk}"
            `;

            try {
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                const questions = JSON.parse(cleanedJson);

                if (Array.isArray(questions)) {
                    // Bulk Insert
                    await prisma.question.createMany({
                        data: questions.map((q: any) => ({
                            text: q.question,
                            options: q.options,
                            correctIndex: q.correctIndex,
                            explanation: q.explanation || "No explanation provided.",
                            topicId: topic.id
                        }))
                    });
                    totalQuestions += questions.length;
                    console.log(`Saved ${questions.length} questions from chunk ${i + 1}.`);
                }
            } catch (err) {
                console.error(`Error parsing chunk ${i + 1}:`, err);
                // Continue to next chunk
            }
        }

        return { topic: topic.name, count: totalQuestions };

    } catch (error) {
        console.error("Bulk Ingest Error:", error);
        return null;
    }
}
