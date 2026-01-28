
"use client";

import { Brain, Flame, Target, Trophy, ArrowRight, BookOpen, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
    // Determine the most useful landing page.
    // If we have a personal dashboard, maybe we redirect there? 
    // BUT user wanted it "below profile", so landing here might be confusing if the nav isn't highlighted?
    // Let's redirect to Syllabus as it is the "Start" of study usually.
    // Or just Redirect to the new Personal Dashboard anyway, as it is the 'home'.

    // Using Next.js redirect
    // We can't use `redirect` in client component, use `useRouter`.
    // But better to use server generic redirect or just render the Personal Dashboard here?

    // Wait, if I render Personal Dashboard here, then the link "Dashboard" (which I removed) is effectively this page.
    // The link "Personal Dashboard" points to `/dashboard/personal`.
    // So if user goes to `/dashboard`, they should probably be redirected to `/dashboard/planner` or `/dashboard/personal`.

    // Let's do a client redirect for now.

    return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
                <meta httpEquiv="refresh" content="0;url=/dashboard/personal" />
            </div>
        </div>
    );
}
