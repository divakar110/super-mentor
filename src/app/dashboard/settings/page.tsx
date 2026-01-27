
"use client";

import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
            </FadeIn>

            <StaggerContainer className="grid gap-6">
                <StaggerItem className="rounded-xl border bg-card text-card-foreground shadow transition-shadow hover:shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Appearance</h3>
                        <p className="text-sm text-muted-foreground">
                            Customize the look and feel of your workspace.
                        </p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Dark Mode</label>
                                <p className="text-sm text-muted-foreground">
                                    Toggle dark mode on or off
                                </p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary/20 p-1 cursor-pointer">
                                <div className="h-4 w-4 rounded-full bg-primary shadow-sm" />
                            </div>
                        </div>
                    </div>
                </StaggerItem>

                <StaggerItem className="rounded-xl border bg-card text-card-foreground shadow transition-shadow hover:shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                            Configure how you receive notifications.
                        </p>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Email Notifications</label>
                                <p className="text-sm text-muted-foreground">
                                    Receive daily summaries of your progress
                                </p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary p-1 cursor-pointer">
                                <div className="ml-auto h-4 w-4 rounded-full bg-background shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Study Reminders</label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when it's time to study
                                </p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary p-1 cursor-pointer">
                                <div className="ml-auto h-4 w-4 rounded-full bg-background shadow-sm" />
                            </div>
                        </div>
                    </div>
                </StaggerItem>

                <StaggerItem className="rounded-xl border bg-card text-card-foreground shadow transition-shadow hover:shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Account</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your account details and subscription.
                        </p>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Current Plan</div>
                                <div className="text-sm text-muted-foreground">Free Tier</div>
                            </div>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 h-9 px-4 py-2">
                                Upgrade to Pro
                            </button>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="space-y-0.5">
                                <div className="font-medium text-destructive">Danger Zone</div>
                                <div className="text-sm text-muted-foreground">Delete your account and all data</div>
                            </div>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-100 hover:text-red-700 h-9 px-4 py-2 text-destructive">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </StaggerItem>
            </StaggerContainer>
        </div>
    );
}
