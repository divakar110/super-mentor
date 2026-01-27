
"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, Layers, Globe, Scale, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const syllabusData = {
    GS1: {
        title: "Indian Heritage and Culture, History and Geography of the World and Society",
        icon: Globe,
        color: "text-orange-500",
        topics: [
            "Indian Culture: Art Forms, Literature and Architecture from ancient to modern times.",
            "Modern Indian History from about the middle of the eighteenth century until the present- significant events, personalities, issues.",
            "The Freedom Struggle - its various stages and important contributors/contributions from different parts of the country.",
            "Post-independence consolidation and reorganization within the country.",
            "History of the world will include events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization.",
            "Salient features of Indian Society, Diversity of India.",
            "Role of women and women's organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies.",
            "Effects of globalization on Indian society.",
            "Social empowerment, communalism, regionalism & secularism.",
            "Salient features of world's physical geography.",
            "Distribution of key natural resources across the world (including South Asia and the Indian sub-continent)."
        ]
    },
    GS2: {
        title: "Governance, Constitution, Polity, Social Justice and International Relations",
        icon: Scale,
        color: "text-blue-500",
        topics: [
            "Indian Constitution—historical underpinnings, evolution, features, amendments, significant provisions and basic structure.",
            "Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure.",
            "Separation of powers between various organs dispute redressal mechanisms and institutions.",
            "Comparison of the Indian constitutional scheme with that of other countries.",
            "Parliament and State legislatures—structure, functioning, conduct of business, powers & privileges and issues arising out of these.",
            "Structure, organization and functioning of the Executive and the Judiciary.",
            "Salient features of the Representation of People's Act.",
            "Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies.",
            "Statutory, regulatory and various quasi-judicial bodies.",
            "Government policies and interventions for development in various sectors and issues arising out of their implementation."
        ]
    },
    GS3: {
        title: "Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management",
        icon: Layers,
        color: "text-green-500",
        topics: [
            "Indian Economy and issues relating to planning, mobilization, of resources, growth, development and employment.",
            "Inclusive growth and issues arising from it.",
            "Government Budgeting.",
            "Major crops-cropping patterns in various parts of the country, different types of irrigation and irrigation systems storage.",
            "Issues related to direct and indirect farm subsidies and minimum support prices.",
            "Food processing and related industries in India- scope' and significance, location, upstream and downstream requirements, supply chain management.",
            "Land reforms in India.",
            "Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth.",
            "Infrastructure: Energy, Ports, Roads, Airports, Railways etc.",
            "Investment models."
        ]
    },
    GS4: {
        title: "Ethics, Integrity and Aptitude",
        icon: Lightbulb,
        color: "text-purple-500",
        topics: [
            "Ethics and Human Interface: Essence, determinants and consequences of Ethics in-human actions.",
            "Human Values - lessons from the lives and teachings of great leaders, reformers and administrators.",
            "Attitude: content, structure, function; its influence and relation with thought and behaviour.",
            "Aptitude and foundational values for Civil Service, integrity, impartiality and non-partisanship.",
            "Emotional intelligence-concepts, and their utilities and application in administration and governance.",
            "Contributions of moral thinkers and philosophers from India and world.",
            "Public/Civil service values and Ethics in Public administration: Status and problems.",
            "Probity in Governance: Concept of public service; Philosophical basis of governance and probity.",
            "Case Studies on above issues."
        ]
    }
};

export default function SyllabusPage() {
    const [activeTab, setActiveTab] = useState<keyof typeof syllabusData>("GS1");

    return (
        <div className="space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">UPSC Syllabus</h1>
                    <p className="text-muted-foreground mt-1">Detailed breakdown of General Studies papers.</p>
                </div>
            </FadeIn>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 p-1 bg-secondary/30 rounded-xl backdrop-blur-sm border">
                {(Object.keys(syllabusData) as Array<keyof typeof syllabusData>).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === tab
                                ? "text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeSyllabusTab"
                                className="absolute inset-0 bg-primary rounded-lg shadow-md"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {tab}
                            <span className="hidden md:inline font-normal opacity-80">- {tab === 'GS1' ? 'History & Geo' : tab === 'GS2' ? 'Polity' : tab === 'GS3' ? 'Economy' : 'Ethics'}</span>
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl border bg-card overflow-hidden shadow-sm"
                >
                    <div className="border-b bg-secondary/5 p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-background shadow-sm ${syllabusData[activeTab].color}`}>
                                {(() => {
                                    const Icon = syllabusData[activeTab].icon;
                                    return <Icon className="h-8 w-8" />;
                                })()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">{activeTab}</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">{syllabusData[activeTab].title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                            {syllabusData[activeTab].topics.map((topic, index) => (
                                <StaggerItem
                                    key={index}
                                    className="group flex items-start gap-3 p-4 rounded-xl border bg-background/50 hover:bg-secondary/20 hover:border-primary/20 transition-all cursor-default"
                                >
                                    <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                                        {topic}
                                    </p>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
