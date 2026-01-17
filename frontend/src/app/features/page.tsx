"use client";

import SiteHeader from "@/components/SiteHeader";
import {
    ChatBubbleBottomCenterTextIcon,
    CpuChipIcon,
    BoltIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export default function FeaturesPage() {
    const features = [
        {
            title: "Advanced LLM Integration",
            desc: "Powered by the latest open-source models, NOVA provides nuanced, context-aware responses that rival proprietary solutions.",
            icon: CpuChipIcon
        },
        {
            title: "Real-time Intelligence",
            desc: "Experience zero-lag processing. Our infrastructure is optimized for high-speed inference without compromising on quality.",
            icon: BoltIcon
        },
        {
            title: "Privacy First",
            desc: "Your data is your own. NOVA is designed with privacy-centric architecture, ensuring your conversations remain confidential.",
            icon: ShieldCheckIcon
        },
        {
            title: "Global Context",
            desc: "Multilingual support and global knowledge base. NOVA understands diverse cultural nuances and specialized technical domains.",
            icon: GlobeAltIcon
        },
        {
            title: "Creative Writing",
            desc: "From code to poetry, NOVA assists in generating high-quality creative content tailored to your specific style and needs.",
            icon: SparklesIcon
        },
        {
            title: "Interactive UI",
            desc: "A sleek, responsive interface designed for focus. Enjoy a distraction-free environment for your most important work.",
            icon: ChatBubbleBottomCenterTextIcon
        }
    ];

    return (
        <div className="min-h-screen">
            <SiteHeader />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
                        Unleashing the Power of <span className="nova-text nova-glow">NOVA</span>
                    </h1>
                    <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto">
                        Explore the features that make NOVA the leading open-source choice for intelligent conversations and high-quality generation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="nova-panel rounded-3xl p-8 nova-soft-shadow hover:scale-[1.02] transition-transform duration-300">
                            <div className="h-12 w-12 rounded-2xl nova-gradient-frame flex items-center justify-center mb-6">
                                <f.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 nova-panel rounded-3xl p-12 text-center border-dashed border-2 border-white/5">
                    <h2 className="text-3xl font-bold text-white mb-6">Continuously Evolving</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                        As an open-source project, NOVA is updated daily with new capabilities, improved safety filters, and expanded knowledge.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 text-sm border border-white/10">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Version 2.4.0 Live
                    </div>
                </div>
            </main>
        </div>
    );
}
