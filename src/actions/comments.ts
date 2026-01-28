"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export type EntityType = "material" | "topic" | "question";

export async function getComments(entityId: string, type: EntityType) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const whereClause: any = {};
    if (type === "material") whereClause.materialId = entityId;
    if (type === "topic") whereClause.topicId = entityId;
    if (type === "question") whereClause.questionId = entityId;

    // Only fetch top-level comments (no parentId)
    // We will fetch replies recursively or just 1 level deep
    // For simplicity, let's fetch ALL comments for this entity and organize them in client or fetch threaded
    // Better: Fetch roots and include replies

    const comments = await db.comment.findMany({
        where: {
            ...whereClause,
            parentId: null
        },
        include: {
            user: { select: { name: true, image: true } },
            replies: {
                include: {
                    user: { select: { name: true, image: true } }
                },
                orderBy: { createdAt: "asc" }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return comments;
}

export async function addComment(
    entityId: string,
    type: EntityType,
    content: string,
    parentId?: string
) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    if (!content.trim()) return { error: "Content cannot be empty" };

    try {
        const data: any = {
            content,
            userId: session.user.id,
            parentId: parentId || null
        };

        if (type === "material") data.materialId = entityId;
        if (type === "topic") data.topicId = entityId;
        if (type === "question") data.questionId = entityId;

        await db.comment.create({ data });

        revalidatePath("/dashboard"); // Brute force revalidate
        return { success: true };

    } catch (error) {
        console.error("Add Comment Error:", error);
        return { error: "Failed to add comment" };
    }
}

export async function getOrCreateTopicId(slug: string, name: string) {
    try {
        const existing = await db.topic.findFirst({ where: { slug } });
        if (existing) return existing.id;

        const newTopic = await db.topic.create({
            data: {
                name,
                slug,
            }
        });
        return newTopic.id;
    } catch (e) {
        console.error("Topic creation failed", e);
        return null;
    }
}
