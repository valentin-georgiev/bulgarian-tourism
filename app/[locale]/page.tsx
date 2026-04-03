import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Waves, Mountain, Flame, Building2, Fish, Footprints, Umbrella, Map, Landmark, TreePine } from 'lucide-react';
import type { Category } from '@/types/place';

type Props = {
  params: Promise<{ locale: string }>;
};

const CATEGORY_ICONS = [
  { key: 'mountain', icon: Mountain, color: 'bg-slate-100 text-slate-700' },
  { key: 'lake',     icon: Waves,    color: 'bg-blue-100 text-blue-700' },
  { key: 'cave',     icon: Flame,    color: 'bg-amber-100 text-amber-700' },
  { key: 'city',     icon: Building2, color: 'bg-purple-100 text-purple-700' },
  { key: 'fishing',  icon: Fish,     color: 'bg-cyan-100 text-cyan-700' },
  { key: 'trail',    icon: Footprints, color: 'bg-green-100 text-green-700' },
  { key: 'beach',    icon: Umbrella,   color: 'bg-yellow-100 text-yellow-700' },
  { key: 'museum',   icon: Landmark,   color: 'bg-rose-100 text-rose-700' },
  { key: 'hiking',   icon: TreePine,   color: 'bg-emerald-100 text-emerald-700' },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tc = await getTranslations('categories');

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mb-10">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/places`}
              className="px-8 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-green-50 transition-colors shadow"
            >
              {t('cta_explore')}
            </Link>
            <Link
              href={`/${locale}/map`}
              className="flex items-center gap-2 px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              <Map className="w-4 h-4" />
              {t('cta_map')}
            </Link>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {CATEGORY_ICONS.map(({ key, icon: Icon, color }) => (
            <Link
              key={key}
              href={`/${locale}/places?category=${key}`}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </span>
              <span className="text-sm font-medium text-gray-700">
                {tc(key as Category)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about_title')}</h2>
          <p className="text-gray-600 leading-relaxed">{t('about_text')}</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-sm font-medium text-green-700 hover:text-green-800 underline"
          >
            GitHub →
          </a>
        </div>
      </section>
    </>
  );
}
