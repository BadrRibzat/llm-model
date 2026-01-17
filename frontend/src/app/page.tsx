"use client";

import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, BoltIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-24 sm:py-32 flex flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl nova-panel nova-neon-shadow animate-bounce">
            <SparklesIcon className="h-8 w-8 text-indigo-400" />
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight">
            Meet <span className="nova-text nova-glow">NOVA</span>
          </h1>

          <p className="mt-8 text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            The most advanced open-source AI assistant. Designed for <span className="text-white font-medium">high-performance</span> conversations and <span className="text-white font-medium">creative intelligence</span>.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href={user ? "/chat" : "/register"}
              className="group relative rounded-2xl px-8 py-4 text-lg text-white nova-button nova-neon-shadow font-bold transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                {user ? "Enter Workspace" : "Launch NOVA"}
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/features"
              className="rounded-2xl px-8 py-4 text-lg border border-white/10 text-slate-200 hover:bg-white/5 transition-all hover:border-white/20 font-medium"
            >
              See What's New
            </Link>
          </div>
        </div>

        {/* Quick Bento Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-32">
          <div className="lg:col-span-2 nova-panel rounded-3xl p-8 nova-soft-shadow">
            <ShieldCheckIcon className="h-10 w-10 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Privacy Core</h3>
            <p className="text-slate-400 mb-6">Built from the ground up to respect your data. No tracking, no selling, just pure intelligence.</p>
            <Link href="/about" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
              Learn about our vision <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="nova-panel rounded-3xl p-8 nova-soft-shadow">
            <BoltIcon className="h-10 w-10 text-pink-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Instant Speed</h3>
            <p className="text-slate-400">Zero-lag responses with optimized server-side inference.</p>
          </div>

          <div className="nova-panel rounded-3xl p-8 nova-soft-shadow flex flex-col justify-between">
            <div>
              <SparklesIcon className="h-10 w-10 text-amber-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Infinite Creativity</h3>
              <p className="text-slate-400">From code snippets to deep poetry, NOVA handles it all.</p>
            </div>
            <Link href="/features" className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/5 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors">
              Full breakdown
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
