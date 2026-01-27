
"use client";

import { User, Mail, Phone, MapPin, Award, BookOpen, Trophy } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 p-8 shadow-lg">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row items-center gap-8 z-10">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-background bg-secondary flex items-center justify-center shadow-xl">
                                <User className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-500 border-4 border-background" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Student Name</h1>
                            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                <Award className="h-4 w-4 text-accent" />
                                Premium Member • UPSC 2026 Aspirant
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur">
                                    <Mail className="h-3 w-3" /> student@example.com
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur">
                                    <Phone className="h-3 w-3" /> +91 98765 43210
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur">
                                    <MapPin className="h-3 w-3" /> New Delhi, India
                                </span>
                            </div>
                        </div>
                        <div className="md:ml-auto flex gap-4">
                            <div className="text-center p-4 rounded-2xl bg-background/50 backdrop-blur border shadow-sm">
                                <div className="text-2xl font-bold text-primary">12</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Day Streak</div>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-background/50 backdrop-blur border shadow-sm">
                                <div className="text-2xl font-bold text-accent">85%</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Accuracy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <StaggerContainer className="grid gap-6 md:grid-cols-2">
                <StaggerItem className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Current Focus
                    </h2>
                    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>GS Paper 1 (History)</span>
                                <span className="text-primary">75%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 rounded-full bg-primary w-[75%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>GS Paper 2 (Polity)</span>
                                <span className="text-emerald-500">40%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 rounded-full bg-emerald-500 w-[40%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Optional Subject</span>
                                <span className="text-accent">60%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 rounded-full bg-accent w-[60%]" />
                            </div>
                        </div>
                    </div>
                </StaggerItem>

                <StaggerItem className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-accent" />
                        Achievements
                    </h2>
                    <div className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                            {[
                                { title: "Early Bird", desc: "Completed 10 morning study sessions", active: true },
                                { title: "Answer Writing Pro", desc: "Submitted 50 answers for review", active: true },
                                { title: "Syllabus Master", desc: "Completed 100% of GS1", active: false },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${item.active ? 'bg-secondary/50' : 'opacity-50 grayscale'}`}>
                                    <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${item.active ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </StaggerItem>
            </StaggerContainer>
        </div>
    );
}
