
"use client";

import { BarChart, Activity, PieChart, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Performance Reports</h1>
                        <p className="text-muted-foreground mt-1">Detailed analysis of your progress across all subjects.</p>
                    </div>
                    <select className="bg-background border rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>All Time</option>
                    </select>
                </div>
            </FadeIn>

            {/* Overview Cards */}
            <StaggerContainer className="grid gap-4 md:grid-cols-3">
                {[
                    { title: "Average Score", value: "86%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
                    { title: "Tests Attempted", value: "24", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { title: "Study Hours", value: "52h", icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
                ].map((stat, i) => (
                    <StaggerItem key={i} className="rounded-2xl border bg-card p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Charts Area (Visualized with CSS/HTML for now) */}
            <div className="grid gap-6 md:grid-cols-2">
                <FadeIn delay={0.2} className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <BarChart className="h-5 w-5 text-primary" />
                                Subject Performance
                            </h3>
                            <p className="text-sm text-muted-foreground">Average scores by GS paper</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: "GS1: History & Geo", score: 75, color: "bg-orange-500" },
                            { label: "GS2: Polity & IR", score: 60, color: "bg-blue-500" },
                            { label: "GS3: Eco & Tech", score: 85, color: "bg-green-500" },
                            { label: "GS4: Ethics", score: 70, color: "bg-purple-500" },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{item.label}</span>
                                    <span>{item.score}%</span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.score}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className={`h-full rounded-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <FadeIn delay={0.3} className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-primary" />
                                Time Distribution
                            </h3>
                            <p className="text-sm text-muted-foreground">Focus areas distribution</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Video Lectures", value: "45%", color: "bg-primary" },
                            { label: "Reading & Notes", value: "30%", color: "bg-blue-400" },
                            { label: "MCQ Practice", value: "15%", color: "bg-indigo-400" },
                            { label: "Answer Writing", value: "10%", color: "bg-sky-300" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </div>
                                <span className="font-bold text-sm">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-primary">AI Insight</h4>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    You are spending a significant amount of time on Video Lectures. Try increasing MCQ practice to 20% to improve retention for GS2 Polity.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
