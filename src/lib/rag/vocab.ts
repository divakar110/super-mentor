import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Function to generate embedding for a single text string
export async function getEmbedding(text: string): Promise<number[]> {
    const result = await model.embedContent(text);
    return result.embedding.values;
}

// Function to generate embeddings for multiple chunks
export async function getEmbeddings(chunks: string[]): Promise<number[][]> {
    // Note: In production, batch this properly as per API limits
    const embeddings: number[][] = [];
    for (const chunk of chunks) {
        const values = await getEmbedding(chunk);
        embeddings.push(values);
    }
    return embeddings;
}

// Helper to chunk text
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 100): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        const chunk = text.slice(i, i + chunkSize);
        chunks.push(chunk);
        i += chunkSize - overlap;
    }
    return chunks;
}
