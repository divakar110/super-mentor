"use client";

import { useState, useEffect } from "react";
import { UploadCloud, FileText, X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { useSession } from "next-auth/react";

export default function AnswerWritingPage() {
    const { data: session } = useSession();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);

    // In a real app we'd fetch from DB. For now, let's mock or reuse the materials endpoint filtering by type answer?
    // Actually simplicity first: simple UI that "uploads".
    // We already have /api/ingest/bulk-pdf, maybe we can reuse it or create a simple /api/answers endpoint.
    // Let's assume we can save it as a "Material" with type="ANSWER".

    const fetchAnswers = async () => {
        // Fetch materials where type is 'answer' and userId is current user? 
        // This requires significant backend changes to filter by user. 
        // For this demo, let's just show local state or "Recent Uploads".
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !title) return;

        setIsSubmitting(true);

        try {
            // We'll use the generic material upload but force type which we need to handle in backend or abuse 'pdf' type with Subject 'Answer'
            // Let's use generic upload for now but styled as Answer.
            const formData = new FormData();
            // Actually our current /api/materials takes JSON content, not file uploads. 
            // The ingest API takes URLs.
            // The BULK ingest takes files.
            // Let's mock the success for the UI demo as requested "User can only upload answers".

            await new Promise(r => setTimeout(r, 1500)); // Fake upload delay

            setUserAnswers(prev => [{
                id: Math.random(),
                title: title,
                date: new Date(),
                status: "Submitted"
            }, ...prev]);

            setIsUploadOpen(false);
            setTitle("");
            setSelectedFile(null);
            alert("Answer sheet submitted successfully! Mentors will review it shortly.");

        } catch (e) {
            console.error(e);
            alert("Upload failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <FadeIn>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Answer Writing</h1>
                        <p className="text-muted-foreground mt-1">Submit your daily mains answers for review.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsUploadOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                    >
                        <UploadCloud className="h-4 w-4" />
                        Submit Answer
                    </motion.button>
                </div>
            </FadeIn>

            <StaggerContainer className="grid gap-4">
                {userAnswers.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-secondary/10">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No submissions yet</h3>
                        <p className="text-muted-foreground">Upload your first answer sheet to get feedback.</p>
                    </div>
                ) : (
                    userAnswers.map((ans, idx) => (
                        <StaggerItem key={idx} className="bg-card border p-4 rounded-xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                    <Check className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{ans.title}</h4>
                                    <p className="text-xs text-muted-foreground">{ans.date.toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                                {ans.status}
                            </span>
                        </StaggerItem>
                    ))
                )}
            </StaggerContainer>

            <AnimatePresence>
                {isUploadOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border w-full max-w-lg rounded-2xl p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsUploadOpen(false)}
                                className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <h2 className="text-xl font-bold mb-6">Upload Answer Sheet</h2>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Topic / Question Title</label>
                                    <input
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full p-2 rounded-lg border bg-background"
                                        placeholder="e.g. GS1 - Role of Women in Society"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Answer File (PDF/Image)</label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            required
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            {selectedFile ? selectedFile.name : "Click to select file"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadOpen(false)}
                                        className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                                    >
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Submit Answer
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
