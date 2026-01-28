import db from "@/lib/db";
import { chunkText, getEmbeddings } from "./vocab";

export async function processAndEmbedMaterial(materialId: string, content: string) {
    if (!content) return;

    try {
        console.log(`Processing RAG for material ${materialId}...`);

        // 1. Chunk content
        const chunks = chunkText(content);

        // 2. Generate Embeddings
        const embeddings = await getEmbeddings(chunks);

        // 3. Store in DB
        // Note: Prisma raw query is needed for inserting vectors if using pgvector directly via standard migration,
        // but Prisma TypedSQL or some ORMs handle it.
        // HOWEVER, standard Prisma Client doesn't natively write `vector` types easily without `TypedSql` or raw queries 
        // in some versions. We will use $executeRaw for safety.

        for (let i = 0; i < chunks.length; i++) {
            const vectorString = `[${embeddings[i].join(",")}]`;

            await db.$executeRaw`
                INSERT INTO "Embedding" ("id", "content", "vector", "materialId", "createdAt")
                VALUES (gen_random_uuid(), ${chunks[i]}, ${vectorString}::vector, ${materialId}, NOW());
             `;
        }

        console.log(`Successfully embedded ${chunks.length} chunks for material ${materialId}`);

    } catch (error) {
        console.error("RAG Processing Error:", error);
    }
}
