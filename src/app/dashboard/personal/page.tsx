"use client";

import { Brain, Flame, Target, Trophy, ArrowRight, BookOpen, Clock, BarChart, TrendingUp, Calendar, Activity, PieChart } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PersonalDashboardPage() {
    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Personal Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Your comprehensive performance and study overview.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="hidden md:block bg-background border rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                        <div className="hidden md:flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                            <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
                            <span className="font-semibold text-amber-700 dark:text-amber-400">12 Day Streak</span>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Combined Stats Overview */}
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Overall Score", value: "840", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+24pts" },
                    { title: "Topics Cleared", value: "12", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+4" },
                    { title: "Tests Attempted", value: "24", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "Top 10%" },
                    { title: "Average Score", value: "86%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+2.5%" },
                ].map((stat, i) => (
                    <StaggerItem key={i} className="rounded-xl border bg-card p-6 shadow-sm overflow-hidden relative group hover:shadow-md transition-all">
                        <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity`}>
                            <stat.icon className={`h-16 w-16 ${stat.color} -rotate-12 transform translate-x-4 -translate-y-4`} />
                        </div>
                        <div className="relative z-10 flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="relative z-10 mt-2">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-emerald-500 font-medium">{stat.trend}</span> from last week
                            </p>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Left Col: Study Plan & AI Insights (From Dashboard) - Spans 4 */}
                <div className="col-span-4 space-y-6">
                    {/* Today's Plan */}
                    <FadeIn delay={0.2} className="rounded-2xl border bg-card shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                Today's Schedule
                            </h3>
                            <Link href="/dashboard/study" className="text-xs text-primary hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Quantum Physics: Wave Mechanics", time: "10:00 AM", status: "Completed", type: "Lecture" },
                                { title: "Organic Chemistry: Alcohols", time: "12:00 PM", status: "In Progress", type: "Practice" },
                                { title: "Calculus: Integration", time: "02:00 PM", status: "Upcoming", type: "Test" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 rounded-xl border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-opacity-20 ${item.status === 'Completed' ? 'bg-emerald-500 ring-emerald-500' : item.status === 'In Progress' ? 'bg-amber-500 ring-amber-500 animate-pulse' : 'bg-slate-300 ring-slate-300'}`} />
                                        <div>
                                            <p className="font-medium text-sm">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">{item.time} • {item.type}</p>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                            item.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                'bg-secondary text-muted-foreground'
                                        }`}>
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* AI Insights & Coaching */}
                    <FadeIn delay={0.3} className="rounded-2xl border bg-gradient-to-br from-card to-primary/5 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Brain className="h-32 w-32" />
                        </div>

                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Brain className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-semibold leading-none tracking-tight">AI Evaluation</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-xl bg-background/50 border backdrop-blur-sm">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    <span className="font-semibold text-foreground">Critical Insight:</span> You are spending significant time on <span className="text-primary font-medium">Video Lectures (45%)</span> but imply lower retention in GS2 Polity.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <p className="text-sm font-medium leading-relaxed">
                                    Recommendation: Shift 20% of video time to active MCQ practice for the next 3 days. I've prepared a Polity drill for you.
                                </p>
                                <button className="mt-3 text-xs bg-background/20 hover:bg-background/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                    <Target className="h-3 w-3" />
                                    Start Polity Drill
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Right Col: Reports & Charts (From Reports) - Spans 3 */}
                <div className="col-span-3 space-y-6">
                    {/* Subject Performance Bar Chart */}
                    <FadeIn delay={0.4} className="rounded-2xl border bg-card p-6 shadow-sm h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold flex items-center gap-2 text-sm">
                                    <BarChart className="h-4 w-4 text-primary" />
                                    Subject Strength
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {[
                                { label: "GS1: History", score: 75, color: "bg-amber-500" },
                                { label: "GS2: Polity", score: 60, color: "bg-blue-500" },
                                { label: "GS3: Eco & Tech", score: 85, color: "bg-emerald-500" },
                                { label: "GS4: Ethics", score: 70, color: "bg-purple-500" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span>{item.label}</span>
                                        <span>{item.score}%</span>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Time Distribution */}
                    <FadeIn delay={0.5} className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold flex items-center gap-2 text-sm">
                                    <PieChart className="h-4 w-4 text-primary" />
                                    Focus Distribution
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Video Lectures", value: "45%", color: "bg-primary" },
                                { label: "Reading & Notes", value: "30%", color: "bg-blue-400" },
                                { label: "MCQ Practice", value: "15%", color: "bg-indigo-400" },
                                { label: "Answer Writing", value: "10%", color: "bg-sky-300" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border bg-secondary/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                        <span className="font-medium text-xs">{item.label}</span>
                                    </div>
                                    <span className="font-bold text-xs">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
