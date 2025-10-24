'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-800">
              Learn PM
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/courses"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                コース一覧
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  ダッシュボード
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Buy Me a Coffee & User */}
          <div className="flex items-center gap-4">
            {/* Buy Me a Coffee Button */}
            <a
              href="https://buymeacoffee.com/ymstshinichiro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#FFDD00] hover:bg-[#FFED4E] text-gray-900 font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              <span className="text-lg">☕</span>
              <span className="hidden sm:inline text-sm">開発者を支援</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
