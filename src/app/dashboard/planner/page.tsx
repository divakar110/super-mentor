"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/motion";
import { Calendar, Clock, BookOpen, Save, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PlannerPage() {
    const [syllabus, setSyllabus] = useState("");
    const [days, setDays] = useState(7);
    const [hours, setHours] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);

    const generatePlan = async () => {
        if (!syllabus.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/planner/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ syllabus, days, hoursPerDay: hours }),
            });
            const data = await res.json();
            if (res.ok) {
                setPlan(data);
            } else {
                alert(data.error || "Failed to generate plan");
            }
        } catch (e) {
            alert("Error connecting to server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">AI Study Planner</h1>
                        <p className="text-muted-foreground">Turn your syllabus into a master plan.</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                        <Calendar className="h-6 w-6" />
                    </div>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Input Form */}
                <FadeIn delay={0.1} className="md:col-span-1 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Syllabus / Topics</label>
                            <textarea
                                value={syllabus}
                                onChange={(e) => setSyllabus(e.target.value)}
                                className="w-full h-40 p-3 rounded-xl bg-secondary/30 border text-sm resize-none focus:ring-2 ring-blue-500/20 outline-none"
                                placeholder="Paste your syllabus here..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block flex justify-between">
                                <span>Duration</span>
                                <span className="text-primary">{days} Days</span>
                            </label>
                            <input
                                type="range"
                                min="3" max="60"
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block flex justify-between">
                                <span>Daily Intensity</span>
                                <span className="text-primary">{hours} Hours</span>
                            </label>
                            <input
                                type="range"
                                min="1" max="8"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <button
                            onClick={generatePlan}
                            disabled={isLoading || !syllabus}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                            {isLoading ? "Planning..." : "Generate Plan"}
                        </button>
                    </div>
                </FadeIn>

                {/* Right: Output View */}
                <FadeIn delay={0.2} className="md:col-span-2">
                    {plan ? (
                        <div className="space-y-6">
                            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-4">{plan.title || "Your Study Schedule"}</h2>
                                <div className="space-y-6">
                                    {plan.schedule.map((day: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="relative pl-8 border-l-2 border-dashed border-border pb-6 last:pb-0"
                                        >
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-background" />
                                            <div className="mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Day {day.day}</span>
                                                <h3 className="text-lg font-semibold">{day.topic}</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {day.activities.map((act: any, j: number) => (
                                                    <div key={j} className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg text-sm">
                                                        <div className={`mt-0.5 p-1 rounded ${act.type === 'Learn' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                            {act.type === 'Learn' ? <BookOpen className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">{act.type}</span>
                                                                <span className="text-xs text-muted-foreground">{act.duration}</span>
                                                            </div>
                                                            <p className="text-muted-foreground mt-0.5">{act.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl text-muted-foreground bg-secondary/10">
                            <Calendar className="h-12 w-12 mb-4 opacity-20" />
                            <p className="max-w-xs">Enter your syllabus on the left and let AI organize your learning journey.</p>
                        </div>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
