import Link from 'next/link';
import { HeartIcon, BeakerIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">AI Chat Model</Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/#features" className="text-gray-500 hover:text-gray-900">Features</Link>
              <Link href="/#about" className="text-gray-500 hover:text-gray-900">About</Link>
              <Link href="/support" className="text-indigo-600 hover:text-indigo-900 font-medium">Support</Link>
              <Link href="/admin" className="text-gray-500 hover:text-gray-900">Admin</Link>
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-500 hover:text-gray-900">
                  Sign In
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Support Page Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <HeartIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support AI Chat Model</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your support helps keep AI Chat Model free, open source, and continuously improving.
            Every contribution makes a difference in advancing AI accessibility and development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ko-fi Support */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <BeakerIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Support on Ko-fi</h2>
            <p className="text-gray-600 mb-6">
              Buy me a coffee or make a one-time donation. Ko-fi is a simple way to support creators
              and open source projects like AI Chat Model.
            </p>
            <a
              href="https://ko-fi.com/badrribzat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <BeakerIcon className="mr-2 h-5 w-5" />
              Visit Ko-fi
            </a>
          </div>

          {/* PayPal Support */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Donate via PayPal</h2>
            <p className="text-gray-600 mb-6">
              Make a secure donation through PayPal. Your support helps fund server costs,
              development tools, and continued improvement of AI Chat Model.
            </p>
            <a
              href="https://paypal.me/BadrRibzat1990"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
            >
              <CurrencyDollarIcon className="mr-2 h-5 w-5" />
              Donate with PayPal
            </a>
          </div>
        </div>

        {/* Why Support Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Support AI Chat Model?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Free & Open Source</h3>
              <p className="text-gray-600 text-sm">
                AI Chat Model remains completely free and open source, licensed under GNU GPL v3.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Continuous Development</h3>
              <p className="text-gray-600 text-sm">
                Support enables ongoing development, bug fixes, and new features for better AI experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Global Accessibility</h3>
              <p className="text-gray-600 text-sm">
                Help make advanced AI technology accessible to developers and users worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Every contribution, no matter the size, helps sustain and grow this project.
            Thank you for considering supporting AI Chat Model!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Home
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try AI Chat Model
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}