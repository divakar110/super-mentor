
import { Brain } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <Link href="/" className="mb-8 flex items-center justify-center gap-2 transition-transform hover:scale-105">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">SuperMentor</span>
                </Link>
                {children}
            </div>
        </div>
    );
}
