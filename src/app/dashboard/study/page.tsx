"use client";

import { useState, useEffect } from "react";
import { FileText, Video, Download, Plus, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { getApiUrl } from "@/lib/config";
import StudyChat from "@/components/StudyChat";
import { MessageSquare, ExternalLink } from "lucide-react";

type Material = {
    id: string;
    title: string;
    subject: string;
    type: string;
    createdAt: Date;
    url: string;
    content?: string | null;
};

export default function StudyPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMaterials = async () => {
        try {
            const response = await fetch(getApiUrl("/api/materials"));
            if (response.ok) {
                const data = await response.json();
                // Ensure dates are converted properly since JSON dates are strings
                const formattedData = data.map((item: any) => ({
                    ...item,
                    createdAt: new Date(item.createdAt)
                }));
                setMaterials(formattedData);
            }
        } catch (error) {
            console.error("Failed to fetch materials:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const [activeTab, setActiveTab] = useState("All");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newSubject, setNewSubject] = useState("Polity");
    const [newType, setNewType] = useState<"pdf" | "video">("pdf");
    const [newContent, setNewContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Chat State
    const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

    const subjects = ["All", "Polity", "History", "Economy", "Geography"];

    const filteredMaterials = activeTab === "All"
        ? materials
        : materials.filter(m => m.subject === activeTab);

    const [uploadMode, setUploadMode] = useState<"manual" | "agent">("manual");
    const [agentUrl, setAgentUrl] = useState("");

    const handleAgentUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agentUrl) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(getApiUrl("/api/ingest"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: agentUrl }),
            });

            if (response.ok) {
                setIsUploadOpen(false);
                setAgentUrl("");
                fetchMaterials();
            } else {
                alert("Agent failed to ingest content. Please check the URL.");
            }
        } catch (error) {
            console.error("Agent Error:", error);
            alert("Connection error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(getApiUrl("/api/materials"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle,
                    subject: newSubject,
                    type: newType,
                    content: newContent
                }),
            });

            if (response.ok) {
                setIsUploadOpen(false);
                setNewTitle("");
                setNewContent("");
                fetchMaterials();
            } else {
                alert("You must be logged in to save materials.");
            }
        } catch (error) {
            console.error("Failed to add material:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportToNotebookLM = async (material: Material) => {
        const confirm = window.confirm("Export this to your Google Drive to use with NotebookLM?");
        if (!confirm) return;

        try {
            const response = await fetch("/api/drive/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: material.title,
                    content: material.content,
                    type: material.type
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.webLink) {
                    window.open("https://notebooklm.google.com/", "_blank");
                    alert("Exported! Opening NotebookLM. \n\n1. Click 'New Notebook'\n2. Click 'Drive'\n3. Select 'Anti Gravity Notebooks' folder.");
                }
            } else {
                const error = await response.json();
                if (error.error && error.error.includes("Unauthorized")) {
                    alert("Please sign in with Google to use this feature.");
                } else {
                    alert("Export failed: " + error.error);
                }
            }
        } catch (e) {
            console.error(e);
            alert("Export failed.");
        }
    };

    return (
        <div className="space-y-8">
            <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Material</h1>
                    <p className="text-muted-foreground mt-1">Access your comprehensive library of resources.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Add Content
                </motion.button>
            </FadeIn>

            {/* Filters */}
            <FadeIn delay={0.1} className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {subjects.map((sub) => (
                    <button
                        key={sub}
                        onClick={() => setActiveTab(sub)}
                        className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${activeTab === sub
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background border text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                    >
                        {sub}
                    </button>
                ))}
            </FadeIn>

            {/* Grid */}
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {filteredMaterials.map((item) => (
                        <StaggerItem
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="group relative rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                {item.type === "pdf" ? <FileText className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                            </div>
                            <div className="mb-3">
                                <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground uppercase tracking-wider">
                                    {item.subject}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="mt-2 text-xs text-muted-foreground font-medium">Added on {new Date(item.createdAt).toLocaleDateString()}</p>

                            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.type}</span>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setActiveMaterial(item)}
                                        className="rounded-full p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                        title="Chat with this material"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleExportToNotebookLM(item)}
                                        className="rounded-full p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                        title="Export & Open NotebookLM"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                    {filteredMaterials.length === 0 && !isLoading && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No materials found. Add some content to get started!
                        </div>
                    )}
                </AnimatePresence>
            </StaggerContainer>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg rounded-2xl border bg-card p-8 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsUploadOpen(false)}
                                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <h2 className="text-2xl font-bold mb-1 text-foreground">Add New Content</h2>
                            <p className="text-sm text-muted-foreground mb-6">Upload materials for your AI mentor to learn from.</p>

                            {/* Toggle Mode */}
                            <div className="flex p-1 bg-secondary rounded-lg mb-6">
                                <button
                                    onClick={() => setUploadMode("manual")}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${uploadMode === "manual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Manual Entry
                                </button>
                                <button
                                    onClick={() => setUploadMode("agent")}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${uploadMode === "agent" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Agent Import ✨
                                </button>
                            </div>

                            {uploadMode === "manual" ? (
                                <form onSubmit={handleUpload} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Title</label>
                                        <input
                                            required
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full rounded-lg border bg-secondary/30 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="e.g., Ancient History Notes"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Subject</label>
                                            <div className="relative">
                                                <select
                                                    value={newSubject}
                                                    onChange={(e) => setNewSubject(e.target.value)}
                                                    className="w-full rounded-lg border bg-secondary/30 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                                                >
                                                    {subjects.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                    <Filter className="h-3.5 w-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Type</label>
                                            <div className="relative">
                                                <select
                                                    value={newType}
                                                    onChange={(e) => setNewType(e.target.value as any)}
                                                    className="w-full rounded-lg border bg-secondary/30 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                                                >
                                                    <option value="pdf">PDF Document</option>
                                                    <option value="video">Video URL</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                    <FileText className="h-3.5 w-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Paste Content (For AI to read)</label>
                                        <textarea
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            className="w-full rounded-lg border bg-secondary/30 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px] transition-all resize-none"
                                            placeholder="Paste your notes here..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsUploadOpen(false)}
                                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-md transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Adding..." : "Add Material"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleAgentUpload} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Web Article / Blog URL</label>
                                        <input
                                            required
                                            type="url"
                                            value={agentUrl}
                                            onChange={(e) => setAgentUrl(e.target.value)}
                                            className="w-full rounded-lg border bg-secondary/30 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="https://wikipedia.org/wiki/India..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            The Agent will visit this URL, read the content, summarize it into study notes, and add it to your library automatically.
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsUploadOpen(false)}
                                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-md transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Agent Working..." : "Run Agent"}
                                        </button>
                                    </div>
                                </form>
                            )}

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Chat Modal */}
            <AnimatePresence>
                {activeMaterial && (
                    <StudyChat
                        materialId={activeMaterial.id}
                        materialTitle={activeMaterial.title}
                        onClose={() => setActiveMaterial(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
