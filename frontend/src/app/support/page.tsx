import Link from 'next/link';
import { HeartIcon, BeakerIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import SiteHeader from "@/components/SiteHeader";

export default function Support() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Support Page Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <HeartIcon className="mx-auto h-16 w-16 text-pink-500 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Support <span className="nova-text nova-glow">NOVA</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your support helps keep NOVA free, open source, and continuously improving.
            Every contribution makes a difference in advancing AI accessibility and development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ko-fi Support */}
          <div className="nova-panel rounded-2xl p-8 text-center nova-soft-shadow">
            <BeakerIcon className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">Support on Ko-fi</h2>
            <p className="text-slate-400 mb-6">
              Buy me a coffee or make a one-time donation. Ko-fi is a simple way to support creators
              and open source projects like NOVA.
            </p>
            <a
              href="https://ko-fi.com/badrribzat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white nova-button nova-neon-shadow transition-colors"
            >
              <BeakerIcon className="mr-2 h-5 w-5" />
              Visit Ko-fi
            </a>
          </div>

          {/* PayPal Support */}
          <div className="nova-panel rounded-2xl p-8 text-center nova-soft-shadow">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">Donate via PayPal</h2>
            <p className="text-slate-400 mb-6">
              Make a secure donation through PayPal. Your support helps fund server costs,
              development tools, and continued improvement of NOVA.
            </p>
            <a
              href="https://paypal.me/BadrRibzat1990"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-900/20 transition-colors"
            >
              <CurrencyDollarIcon className="mr-2 h-5 w-5" />
              Donate with PayPal
            </a>
          </div>
        </div>

        {/* Why Support Section */}
        <div className="nova-panel rounded-2xl p-8 mb-8 nova-soft-shadow">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Why Support NOVA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Free & Open Source</h3>
              <p className="text-slate-400 text-sm">
                NOVA remains completely free and open source, licensed under GNU GPL v3.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Continuous Development</h3>
              <p className="text-slate-400 text-sm">
                Support enables ongoing development, bug fixes, and new features for better AI experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Global Accessibility</h3>
              <p className="text-slate-400 text-sm">
                Help make advanced AI technology accessible to developers and users worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-slate-400 mb-6 font-medium">
            Every contribution, no matter the size, helps sustain and grow this project.
            Thank you for considering supporting NOVA!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-white/10 shadow-sm text-base font-medium rounded-xl text-slate-200 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white nova-button nova-neon-shadow"
            >
              Try NOVA
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}