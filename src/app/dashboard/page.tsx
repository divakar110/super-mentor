
"use client";

import { Brain, Flame, Target, Trophy, ArrowRight, BookOpen, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Student!</h1>
                        <p className="text-muted-foreground mt-1">Here's your daily progress overview.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border">
                        <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                        <span className="font-semibold">12 Day Streak</span>
                    </div>
                </div>
            </FadeIn>

            {/* Stats Overview */}
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Study Hours", value: "4.5h", icon: Clock, color: "text-blue-500", trend: "+12%" },
                    { title: "Topics Cleared", value: "12", icon: BookOpen, color: "text-purple-500", trend: "+4" },
                    { title: "Tests Taken", value: "8", icon: Brain, color: "text-amber-500", trend: "Top 10%" },
                    { title: "Overall Score", value: "840", icon: Trophy, color: "text-green-500", trend: "+24pts" },
                ].map((stat, i) => (
                    <StaggerItem key={i} className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-green-500 font-medium">{stat.trend}</span> from last week
                        </p>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity / Plan */}
                <FadeIn delay={0.2} className="col-span-4 rounded-xl border bg-card shadow-sm">
                    <div className="p-6">
                        <h3 className="font-semibold leading-none tracking-tight mb-4">Today's Study Plan</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Quantum Physics: Wave Mechanics", time: "10:00 AM", status: "Completed", type: "Lecture" },
                                { title: "Organic Chemistry: Alcohols", time: "12:00 PM", status: "In Progress", type: "Practice" },
                                { title: "Calculus: Integration", time: "02:00 PM", status: "Upcoming", type: "Test" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-2 w-2 rounded-full ${item.status === 'Completed' ? 'bg-green-500' : item.status === 'In Progress' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                                        <div>
                                            <p className="font-medium text-sm">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">{item.time} • {item.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium px-2 py-1 rounded bg-background border">
                                        {item.status}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Link href="/dashboard/study" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View full schedule <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </FadeIn>

                {/* AI Recommendations */}
                <FadeIn delay={0.3} className="col-span-3 rounded-xl border bg-card shadow-sm">
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Brain className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-semibold leading-none tracking-tight">AI Insights</h3>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    <span className="font-semibold text-foreground">Tip:</span> You've been struggling with <span className="text-primary font-medium">Thermodynamics</span>.
                                    I've prepared a quick 10-minute quiz to help you revise the core concepts.
                                </p>
                                <button className="mt-3 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:bg-primary/90 transition-colors">
                                    Start Quiz
                                </button>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 border">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Great job on the Physics test! Your speed has improved by 15%.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
