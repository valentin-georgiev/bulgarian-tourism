'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Mountain } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg text-green-700 hover:text-green-800 transition-colors">
            <Mountain className="w-6 h-6" />
            <span>Bulgarian Tourism</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href={`/${locale}`} className="hover:text-green-700 transition-colors">
              {t('home')}
            </Link>
            <Link href={`/${locale}/places`} className="hover:text-green-700 transition-colors">
              {t('places')}
            </Link>
            <Link href={`/${locale}/map`} className="hover:text-green-700 transition-colors">
              {t('map')}
            </Link>
          </nav>

          {/* Language switcher */}
          <div className="flex items-center gap-1 text-sm font-medium">
            <Link
              href={`/en${locale === 'en' ? '' : ''}`}
              className={`px-2 py-1 rounded transition-colors ${locale === 'en' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700'}`}
            >
              EN
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href={`/bg`}
              className={`px-2 py-1 rounded transition-colors ${locale === 'bg' ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-green-700'}`}
            >
              БГ
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
