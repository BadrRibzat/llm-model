'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on chat page
  if (pathname === '/chat') {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About the Developer</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> Badr Ribzat</p>
              <p>
                <strong>GitHub:</strong>{' '}
                <a
                  href="https://github.com/BadrRibzat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  github.com/BadrRibzat
                </a>
              </p>
              <p>
                <strong>LinkedIn:</strong>{' '}
                <a
                  href="https://www.linkedin.com/in/badr-ribzat14121990/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  linkedin.com/in/badr-ribzat14121990
                </a>
              </p>
              <p>
                <strong>Vanhack:</strong>{' '}
                <a
                  href="https://vanhack.com/vanhacker/afe29276-5038-44c1-920e-12a09c2c9b0c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  vanhack.com/vanhacker/afe29276-5038-44c1-920e-12a09c2c9b0c
                </a>
              </p>
              <p>
                <strong>Portfolio:</strong>{' '}
                <a
                  href="https://badr-portfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  badr-portfolio.vercel.app
                </a>
              </p>
              <p><strong>Email:</strong> badrribzat@gmail.com</p>
              <p><strong>Phone:</strong> +212627764176</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-gray-300 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support the Project</h3>
            <p className="text-sm text-gray-300 mb-4">
              Help keep AI Chat Model free and open source. Your support enables continued development and improvements.
            </p>
            <div className="space-y-2">
              <a
                href="https://ko-fi.com/badrribzat"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Support on Ko-fi
              </a>
              <a
                href="https://paypal.me/BadrRibzat1990"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Donate via PayPal
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and License */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2026 AI Chat Model. All rights reserved.</p>
              <p className="mt-1">
                This project is licensed under the{' '}
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  GNU General Public License Version 3
                </a>
                , 29 June 2007.
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <p>Built with ❤️ using Next.js, Django, and AI</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}