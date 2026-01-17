"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NovaLogo } from "@/components/NovaLogo";
import { useAuth } from "@/components/AuthContext";

export default function SiteHeader() {
    const { user } = useAuth();
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/40 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Link href="/" className="group">
                    <NovaLogo className="group-hover:opacity-95 transition-opacity" />
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
                    <Link href="/features" className={`hover:text-white transition-colors ${pathname === "/features" ? "text-white" : ""}`}>
                        Features
                    </Link>
                    <Link href="/about" className={`hover:text-white transition-colors ${pathname === "/about" ? "text-white" : ""}`}>
                        About
                    </Link>
                    <Link href="/support" className={`hover:text-white transition-colors ${pathname === "/support" ? "text-white" : ""}`}>
                        Support
                    </Link>

                    {user ? (
                        <>
                            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                            <Link
                                href="/chat"
                                className="inline-flex items-center rounded-xl px-4 py-2 text-white nova-button nova-neon-shadow"
                            >
                                Open Chat
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center rounded-xl px-4 py-2 text-white nova-button nova-neon-shadow"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
