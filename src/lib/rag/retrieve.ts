import db from "@/lib/db";
import { getEmbedding } from "./vocab";

export async function getRelevantContext(query: string, materialId?: string, limit: number = 5): Promise<string> {
    try {
        const queryVector = await getEmbedding(query);
        const vectorString = `[${queryVector.join(",")}]`;

        // Perform vector similarity search
        // We use the <=> operator for cosine distance (or standard distance)
        // Order by distance ascending (closest first)

        // Note: materialId filter is optional. If provided, we search only within that material.

        let results: any[];

        if (materialId) {
            results = await db.$queryRaw`
                SELECT content, 1 - (vector <=> ${vectorString}::vector) as similarity
                FROM "Embedding"
                WHERE "materialId" = ${materialId}
                ORDER BY vector <=> ${vectorString}::vector
                LIMIT ${limit};
            `;
        } else {
            results = await db.$queryRaw`
                SELECT content, 1 - (vector <=> ${vectorString}::vector) as similarity
                FROM "Embedding"
                ORDER BY vector <=> ${vectorString}::vector
                LIMIT ${limit};
            `;
        }

        if (!results || results.length === 0) return "";

        // Combine top chunks into a single context string
        return results.map(r => r.content).join("\n\n---\n\n");

    } catch (error) {
        console.error("Vector Retrieval Error:", error);
        return "";
    }
}
