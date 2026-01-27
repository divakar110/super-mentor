
"use client";

import Link from "next/link";
import { BookOpen, Brain, LayoutDashboard, LogOut, MessageSquare, Settings, User, Menu, CheckSquare, BarChart, Video, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // We can't easily check session in client component without SessionProvider. 
    // For prototype speed, we'll keep it simple: Just show "Sign In" if we can't determine, or maybe just "Exit"
    // Actually, let's leave it as "Sign Out" for now or just generic "Back to Home".
    // User wants "previous like" behavior.

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/planner", label: "Study Planner", icon: Calendar },
        { href: "/dashboard/syllabus", label: "Syllabus (GS1-4)", icon: BookOpen },
        { href: "/dashboard/chat", label: "AI Mentor", icon: MessageSquare },
        { href: "/dashboard/mcq", label: "MCQ Practice", icon: CheckSquare },
        { href: "/dashboard/study", label: "Study Material", icon: Video },
        { href: "/dashboard/reports", label: "Reports", icon: BarChart },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-card/50 backdrop-blur-xl md:block">
                <div className="flex h-16 items-center gap-2 border-b px-6 font-bold text-xl">
                    <motion.div
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Brain className="h-6 w-6 text-primary" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">SuperMentor</span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    {navItems.map((item, i) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group block"
                            >
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + (i * 0.05) }}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors relative z-10 ${isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl bg-primary shadow-lg shadow-primary/20"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="h-4 w-4 relative z-10" />
                                    <span className="relative z-10">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <Link
                        href="/"
                        className="flex w-full items-center gap-3 rounded-lg border bg-background/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground group"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                {/* Mobile Header */}
                <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 backdrop-blur-md px-4 md:hidden justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="h-6 w-6 text-primary" />
                        <span className="font-bold">SuperMentor</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-16 z-20 bg-background/95 backdrop-blur-sm p-4 md:hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="p-4 md:p-8 pt-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
