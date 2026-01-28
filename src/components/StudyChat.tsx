"use client";

import { useChat } from "ai/react";
import { Send, Bot, User, Loader2, BookOpen, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StudyChatProps {
    materialId: string;
    materialTitle: string;
    onClose: () => void;
}

export default function StudyChat({ materialId, materialTitle, onClose }: StudyChatProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        body: { materialId },
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl h-[600px] bg-card rounded-2xl shadow-2xl flex flex-col border border-border overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">Study Mentor</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <BookOpen className="h-3 w-3" />
                                Chatting about: <span className="font-medium text-foreground">{materialTitle}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground opacity-60">
                            <Bot className="h-12 w-12 mb-4 text-primary/40" />
                            <p className="text-sm">Ask me anything about these notes!</p>
                            <p className="text-xs mt-2">Example: "Summarize this for me" or "Create a quiz"</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`
                                h-8 w-8 rounded-full flex items-center justify-center shrink-0
                                ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                            `}>
                                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`
                                px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed
                                ${m.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted/50 border border-border rounded-tl-none'}
                            `}>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {m.content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-1 last:mb-0">{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="bg-muted/30 px-4 py-2 rounded-2xl rounded-tl-none flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 border-t bg-card">
                    <div className="relative flex items-center gap-2">
                        <input
                            className="flex-1 bg-muted/50 border border-input hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/70"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
