
import Link from "next/link";
import { ArrowRight, Brain, Target, Trophy, CheckCircle, Zap, Shield } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background overflow-hidden relative">
      <BackgroundBeams />

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link className="flex items-center gap-2 font-bold text-xl group" href="/">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Brain className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">SuperMentor</span>
          </Link>
          <nav className="hidden gap-8 md:flex">
            {["Features", "Testimonials", "Pricing"].map((item) => (
              <Link key={item} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group" href={`#${item.toLowerCase()}`}>
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              className="hidden text-sm font-medium text-muted-foreground hover:text-primary transition-colors md:block"
              href="/login"
            >
              Log in
            </Link>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 hover:shadow-primary/30"
              href="/dashboard"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <FadeIn delay={0.2} className="space-y-4 max-w-4xl mx-auto">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  The Future of Learning is Here
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Your AI Personal Mentor for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 relative">
                    Success
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
                  Master your competitive exams with real-time AI guidance, personalized study plans, and smart analytics.
                  Experience learning that adapts to <span className="font-semibold text-foreground">you</span>.
                </p>
              </FadeIn>

              <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-primary/40 active:scale-95"
                  href="/dashboard"
                >
                  Start Learning Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  href="#features"
                >
                  Learn More
                </Link>
              </FadeIn>

              {/* Stats/Social Proof - Optional */}
              <FadeIn delay={0.6} className="pt-12 flex items-center gap-8 text-muted-foreground text-sm font-medium max-w-2xl mx-auto justify-center flex-wrap opacity-70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Personalized Plans</span>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute -left-[20%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <FadeIn className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything you need to crack it</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Our platform combines advanced AI with proven pedagogy to deliver results that matter.
                </p>
              </FadeIn>
            </div>

            <StaggerContainer className="grid max-w-6xl mx-auto grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Mentorship",
                  desc: "Instant doubts resolution and answer writing feedback from your personal AI tutor, available 24/7.",
                  color: "text-purple-500",
                  bg: "bg-purple-500/10"
                },
                {
                  icon: Target,
                  title: "Daily Targets",
                  desc: "Structured daily plans tailored to your pace and goals. Never wonder 'what to study' again.",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: Trophy,
                  title: "Smart Analytics",
                  desc: "Track your progress with detailed performance reports and identify your weak areas instantly.",
                  color: "text-amber-500",
                  bg: "bg-amber-500/10"
                }
              ].map((feature, idx) => (
                <StaggerItem key={idx} className="group relative overflow-hidden rounded-2xl border bg-background/50 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:bg-background/80">
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition-transform group-hover:scale-110`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Additional Benefits Section - Grid */}
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <SlideIn direction="left" className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Why choose <span className="text-primary">SuperMentor?</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Traditional coaching is one-size-fits-all. We believe in one-size-fits-one. Our AI adapts to your learning style, strength, and pace.
                </p>
                <ul className="space-y-4">
                  {[
                    "Real-time feedback on your answers",
                    "Adaptive study schedules that evolve with you",
                    "Comprehensive coverage of syllabus",
                    "distraction-free learning environment"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link href="/dashboard" className="text-primary font-medium hover:underline inline-flex items-center gap-1 group">
                    Explore all features
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </SlideIn>
              <SlideIn direction="right" className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
                <div className="relative aspect-square overflow-hidden rounded-2xl border bg-background/50 shadow-2xl p-8 flex flex-col gap-4">
                  {/* Mock UI Elements */}
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[60%] rounded bg-muted animate-pulse" />
                      <div className="h-3 w-[40%] rounded bg-muted/60 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="h-20 w-full rounded-xl bg-muted/20 animate-pulse" />
                    <div className="h-20 w-full rounded-xl bg-muted/20 animate-pulse delay-75" />
                    <div className="h-20 w-full rounded-xl bg-muted/20 animate-pulse delay-150" />
                  </div>
                  <div className="mt-auto pt-4 border-t flex justify-between items-center">
                    <div className="h-8 w-24 rounded bg-primary/20 animate-pulse" />
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 px-4">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-primary-foreground sm:px-12 sm:py-24 text-center">
              {/* Background circles */}
              <div className="absolute top-0 left-0 h-[300px] w-[300px] bg-white/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 right-0 h-[300px] w-[300px] bg-white/10 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to start your journey?
                </h2>
                <p className="max-w-[600px] mx-auto text-primary-foreground/80 md:text-xl">
                  Join thousands of students who are learning smarter, not harder. Start your free trial today.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center pt-8">
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-full bg-background text-primary px-8 text-base font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                    href="/dashboard"
                  >
                    Get Started for Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-6 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t font-light text-sm text-muted-foreground bg-background relative z-10">
        <p>© 2025 SuperMentor AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-6 sm:gap-8">
          <Link className="hover:text-foreground transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="hover:text-foreground transition-colors" href="#">
            Privacy
          </Link>
          <Link className="hover:text-foreground transition-colors" href="#">
            Twitter
          </Link>
        </nav>
      </footer>
    </div>
  );
}
