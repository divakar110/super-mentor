"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { addComment, getComments, EntityType } from "@/actions/comments";
import { Loader2, MessageSquare, Reply, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: { name: string | null; image: string | null };
    replies?: Comment[];
}

interface CommentsSectionProps {
    entityId: string;
    entityType: EntityType;
    initialComments?: Comment[];
    title?: string;
}

export default function CommentsSection({ entityId, entityType, initialComments = [], title }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(initialComments.length === 0);
    const router = useRouter();

    const refreshComments = useCallback(async () => {
        try {
            const data = await getComments(entityId, entityType);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    }, [entityId, entityType]);

    useEffect(() => {
        // If we didn't get initial comments, fetch them. 
        // Or if we just mounted, we might want to ensure freshness anyway.
        // For simplicity, let's always fetch on mount if we can, to be safe.
        refreshComments();
    }, [refreshComments]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        startTransition(async () => {
            const res = await addComment(entityId, entityType, newComment);
            if (res.success) {
                setNewComment("");
                refreshComments();
                router.refresh();
            }
        });
    };

    return (
        <div className="mt-8 border-t pt-6 text-left">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" />
                {title || `Discussion (${comments.length})`}
            </h3>

            {/* Input */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="w-full min-h-[80px] p-3 rounded-md border resize-y focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                        disabled={isPending}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleAddComment}
                            disabled={isPending || !newComment.trim()}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                entityId={entityId}
                                entityType={entityType}
                                onRefresh={refreshComments}
                            />
                        ))}
                        {comments.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function CommentItem({ comment, entityId, entityType, onRefresh }: { comment: Comment; entityId: string; entityType: EntityType, onRefresh: () => void }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleReply = () => {
        if (!replyContent.trim()) return;

        startTransition(async () => {
            const res = await addComment(entityId, entityType, replyContent, comment.id);
            if (res.success) {
                setReplyContent("");
                setIsReplying(false);
                onRefresh();
                router.refresh();
            }
        });
    };

    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <div className="bg-secondary/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{comment.user.name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                </div>

                <div className="flex items-center gap-4 mt-1 ml-1">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                        <Reply className="w-3 h-3" /> Reply
                    </button>
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-3 ml-2 flex gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex-1">
                            <input
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-2 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => setIsReplying(false)}
                                    className="px-3 py-1 text-xs rounded-md text-muted-foreground hover:bg-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={isPending}
                                    className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium disabled:opacity-50"
                                >
                                    {isPending ? "Posting..." : "Reply"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-secondary/50">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                entityId={entityId}
                                entityType={entityType}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
