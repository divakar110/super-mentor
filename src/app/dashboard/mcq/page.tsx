"use client";

import { useState, useEffect } from "react";
import { CheckSquare, ArrowRight, RefreshCcw, CheckCircle, XCircle, Trophy, BookOpen, BrainCircuit, UploadCloud, Loader2, Library, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";
import { getApiUrl } from "@/lib/config";

// --- TYPES ---
type UnifiedQuestion = {
    id: string | number;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

type Topic = {
    id: string;
    name: string;
    _count?: { questions: number };
};

type ViewState = 'browse' | 'quiz' | 'review';
type Tab = 'library' | 'generator';

export default function MCQPage() {
    // UI State
    const [activeTab, setActiveTab] = useState<Tab>('library');
    const [view, setView] = useState<ViewState>('browse');
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Data State
    const [topics, setTopics] = useState<Topic[]>([]);
    const [currentQuizTitle, setCurrentQuizTitle] = useState("");
    const [questions, setQuestions] = useState<UnifiedQuestion[]>([]);

    // Generator/Upload Inputs
    const [inputText, setInputText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Quiz Session State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string | number, number>>({});

    // Load Library Topics on Mount
    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await fetch(getApiUrl("/api/quiz/topics"));
            if (res.ok) {
                const data = await res.json();
                setTopics(data);
            }
        } catch (e) {
            console.error("Failed to load topics");
        }
    };

    // --- ACTIONS ---

    // 1. Static: Start Quiz from Topic
    const startStaticQuiz = async (topic: Topic) => {
        setIsLoading(true);
        setStatusMessage("Loading Questions...");
        try {
            const res = await fetch(getApiUrl(`/api/quiz/questions?topicId=${topic.id}&limit=20`));
            if (res.ok) {
                const data = await res.json();
                // Map DB schema to UnifiedQuestion if needed (though they should match mostly)
                const mappedQuestions: UnifiedQuestion[] = data.map((q: any) => ({
                    id: q.id,
                    text: q.text,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    explanation: q.explanation || "No explanation provided."
                }));

                setQuestions(mappedQuestions);
                setCurrentQuizTitle(topic.name);
                startSession();
            }
        } catch (e) {
            alert("Failed to load quiz");
        } finally {
            setIsLoading(false);
            setStatusMessage("");
        }
    };

    // 2. Dynamic: Generate Quiz from Input
    const generateQuiz = async () => {
        if (!inputText.trim() && !selectedFile) return;
        setIsLoading(true);
        setStatusMessage("Agent is reading your content...");

        try {
            const formData = new FormData();
            if (inputText.trim()) formData.append("text", inputText);
            if (selectedFile) formData.append("file", selectedFile);

            const res = await fetch(getApiUrl("/api/quiz/generate"), {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.topics && data.topics.length > 0) {
                // Flatten all generated topics into one big quiz for simplicity
                // Or just take the first topic
                const allQuestions: UnifiedQuestion[] = [];
                data.topics.forEach((t: any) => {
                    t.questions.forEach((q: any) => {
                        allQuestions.push({
                            id: Math.random(), // Temp ID
                            text: q.question,
                            options: q.options,
                            correctIndex: q.correct,
                            explanation: q.explanation
                        });
                    });
                });

                setQuestions(allQuestions);
                setCurrentQuizTitle("AI Generated Quiz");
                startSession();
            } else {
                alert(data.error || "Failed to generate quiz.");
            }
        } catch (e) {
            alert("Error connecting to Agent.");
        } finally {
            setIsLoading(false);
            setStatusMessage("");
        }
    };

    // 3. Admin: Upload Bulk PDF to Library
    const handleBulkIngest = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setStatusMessage("Ingesting Question Bank... This may take time.");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch(getApiUrl("/api/ingest/bulk-pdf"), {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                alert(`Success! Added ${data.questionsAdded} questions to: ${data.topic}`);
                fetchTopics();
                setSelectedFile(null);
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) {
            alert("Connection Error");
        } finally {
            setIsLoading(false);
            setStatusMessage("");
        }
    };

    const startSession = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setView('quiz');
    };

    const handleOptionSelect = (qId: string | number, optionIndex: number) => {
        setUserAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setView('review');
        }
    };

    const exitQuiz = () => {
        setView('browse');
        setQuestions([]);
        setCurrentQuizTitle("");
    };

    // --- RENDERERS ---

    const renderBrowser = () => (
        <div className="max-w-5xl mx-auto py-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quiz Portal</h1>
                    <p className="text-muted-foreground">Choose your preferred mode of practice.</p>
                </div>

                <div className="flex bg-secondary p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'library' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Library className="h-4 w-4" /> Library
                    </button>
                    <button
                        onClick={() => setActiveTab('generator')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Sparkles className="h-4 w-4 text-purple-500" /> AI Generator
                    </button>
                </div>
            </div>

            {activeTab === 'library' ? (
                <FadeIn className="space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UploadCloud className="h-5 w-5 text-primary" /> Bulk Upload
                        </h2>
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary file:text-primary-foreground
                                  hover:file:bg-primary/90
                                "
                            />
                            <button
                                onClick={handleBulkIngest}
                                disabled={isLoading || !selectedFile}
                                className="px-6 py-2 bg-secondary hover:bg-secondary/80 rounded-full font-medium text-sm whitespace-nowrap"
                            >
                                {isLoading ? "Uploading..." : "Add to Library"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topics.map(topic => (
                            <motion.div
                                key={topic.id}
                                whileHover={{ y: -5 }}
                                onClick={() => startStaticQuiz(topic)}
                                className="p-6 rounded-2xl border bg-card hover:border-primary/50 cursor-pointer shadow-sm transition-all group"
                            >
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{topic.name}</h3>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {topic._count?.questions || 0} Qs</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </motion.div>
                        ))}
                        {topics.length === 0 && (
                            <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
                                Library is empty. Upload a PDF to populate it!
                            </div>
                        )}
                    </div>
                </FadeIn>
            ) : (
                <FadeIn className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-card border rounded-3xl p-8 shadow-sm text-center space-y-6">
                        <div className="mx-auto h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
                            <BrainCircuit className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Instant Quiz Generator</h2>
                            <p className="text-muted-foreground">Paste notes, upload a chapter, or a screenshot.<br />The AI will quiz you immediately.</p>
                        </div>

                        <div className="text-left space-y-4">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="w-full min-h-[150px] p-4 rounded-xl bg-secondary/30 border focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                                placeholder="Paste your study material here..."
                            />
                            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-secondary/20 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="gen-upload"
                                />
                                <label htmlFor="gen-upload" className="cursor-pointer flex items-center justify-center gap-2 text-sm font-medium">
                                    <UploadCloud className="h-5 w-5" />
                                    {selectedFile ? selectedFile.name : "Upload File (PDF/Image)"}
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={generateQuiz}
                            disabled={isLoading || (!inputText.trim() && !selectedFile)}
                            className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Generating..." : "Generate & Start Quiz"}
                        </button>
                        {statusMessage && <p className="text-sm font-medium text-purple-600 animate-pulse">{statusMessage}</p>}
                    </div>
                </FadeIn>
            )}
        </div>
    );

    const renderQuiz = () => {
        const q = questions[currentQuestionIndex];
        const isSelected = userAnswers[q.id] !== undefined;

        return (
            <div className="max-w-3xl mx-auto py-8 space-y-8">
                <div className="flex items-center justify-between px-4">
                    <button onClick={exitQuiz} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        &larr; Exit
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{currentQuizTitle}</span>
                        <p className="font-mono text-2xl font-bold text-primary">
                            {currentQuestionIndex + 1}<span className="text-muted-foreground text-lg">/{questions.length}</span>
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={q.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="rounded-3xl border bg-card p-6 md:p-10 shadow-sm space-y-8"
                    >
                        <h3 className="text-2xl font-semibold leading-relaxed">{q.text}</h3>

                        <div className="space-y-3">
                            {q.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(q.id, idx)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${userAnswers[q.id] === idx
                                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                                            : "bg-background border-border hover:border-primary/50 hover:bg-secondary/30"
                                        }`}
                                >
                                    <span className="font-medium text-lg">{option}</span>
                                    {userAnswers[q.id] === idx && <CheckSquare className="h-5 w-5 text-primary" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={nextQuestion}
                                disabled={!isSelected}
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    };

    const renderReview = () => {
        let score = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] === q.correctIndex) score++;
        });

        return (
            <div className="max-w-3xl mx-auto space-y-8 py-10">
                <FadeIn className="text-center space-y-4 bg-card border rounded-3xl p-10 shadow-sm">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                    <h2 className="text-3xl font-bold">Quiz Complete!</h2>
                    <p className="text-2xl">You scored <span className="font-bold text-primary">{score}</span> / {questions.length}</p>
                    <button
                        onClick={exitQuiz}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                    >
                        <RefreshCcw className="h-4 w-4" /> Back to Portal
                    </button>
                </FadeIn>

                <div className="space-y-8">
                    {questions.map((q, idx) => {
                        const userAns = userAnswers[q.id];
                        const isCorrect = userAns === q.correctIndex;

                        return (
                            <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                <h3 className="font-bold text-lg mb-4">{idx + 1}. {q.text}</h3>
                                <div className="grid gap-2 mb-4">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className={`p-3 rounded-lg text-sm border ${i === q.correctIndex ? "bg-green-100 dark:bg-green-900/30 border-green-500" :
                                                i === userAns ? "bg-red-100 dark:bg-red-900/30 border-red-500" :
                                                    "opacity-70 bg-background"
                                            }`}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-muted-foreground bg-background/50 p-4 rounded-xl border">
                                    <span className="font-bold">Explanation: </span> {q.explanation}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (isLoading && view === 'browse') {
        return <div className="flex h-screen items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <p className="text-muted-foreground animate-pulse">{statusMessage || "Loading..."}</p>
        </div>;
    }

    if (view === 'quiz') return renderQuiz();
    if (view === 'review') return renderReview();

    return renderBrowser();
}
