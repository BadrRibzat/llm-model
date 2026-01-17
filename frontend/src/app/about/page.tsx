"use client";

import SiteHeader from "@/components/SiteHeader";
import { NovaLogo } from "@/components/NovaLogo";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <SiteHeader />

            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <NovaLogo size={64} showText={false} className="mb-6 mx-auto opacity-50" />
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
                        The Vision Behind <span className="nova-text nova-glow">NOVA</span>
                    </h1>
                    <p className="mt-6 text-xl text-slate-300">
                        Democratizing advanced AI through open-source innovation.
                    </p>
                </div>

                <div className="prose prose-invert prose-slate max-w-none">
                    <section className="nova-panel rounded-3xl p-8 sm:p-12 mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            NOVA was born out of a simple conviction: the most powerful tools of the future should be accessible to everyone, not locked behind corporate paywalls. Our mission is to provide developers, students, and creators with a high-performance LLM that is transparent, customizable, and free to use.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            We believe in an open AI ecosystem where innovation is driven by the community, and where safety and ethics are built into the core, not added as a checkbox.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="nova-panel rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Open Source</h3>
                            <p className="text-slate-400">
                                NOVA is licensed under GNU GPL v3. We share our findings, our weights, and our journey openly with the world.
                            </p>
                        </div>
                        <div className="nova-panel rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Privacy Core</h3>
                            <p className="text-slate-400">
                                We don't sell your data. We don't track your thoughts. NOVA is built to be a safe extension of your mind.
                            </p>
                        </div>
                    </div>

                    <section className="border-l-4 border-indigo-500 pl-8 mb-12 py-4">
                        <h2 className="text-3xl font-bold text-white mb-6">The Journey</h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            Starting as a research experiment into efficient inference, NOVA has grown into a full-featured chat experience used by thousands globally. Every line of code, every design token, and every model layer is crafted with precision to deliver excellence without compromise.
                        </p>
                    </section>

                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Join the Revolution</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                            Whether you are a developer looking to contribute or a user looking for a better AI experience, there is a place for you in the NOVA constellation.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/BadrRibzat"
                                target="_blank"
                                className="nova-button rounded-xl px-8 py-3 text-white font-medium nova-soft-shadow"
                            >
                                View GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
