"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Mountain } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import { useActiveLink } from "@/lib/useActiveLink";

const Navbar = () => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { linkClass } = useActiveLink("navbar");

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-bold text-lg text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
          >
            <Mountain className="w-6 h-6" />
            <span>Bulgarian Tourism</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-slate-300">
            <Link href={`/${locale}`} className={linkClass(`/${locale}`)}>
              {t("home")}
            </Link>
            <Link href={`/${locale}/places`} className={linkClass(`/${locale}/places`)}>
              {t("places")}
            </Link>
            <Link href={`/${locale}/map`} className={linkClass(`/${locale}/map`)}>
              {t("map")}
            </Link>
            <Link href={`/${locale}/about`} className={linkClass(`/${locale}/about`)}>
              {t("about")}
            </Link>
            <Link href={`/${locale}/faq`} className={linkClass(`/${locale}/faq`)}>
              {t("faq")}
            </Link>
          </nav>

          {/* Right side: language switcher + theme toggle + mobile menu */}
          <div className="flex items-center gap-2">
            {/* Language switcher — desktop */}
            <div className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/en"
                className={`px-2 py-1 rounded transition-colors ${locale === "en" ? "text-green-700 dark:text-green-400 font-semibold" : "text-gray-500 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400"}`}
              >
                EN
              </Link>
              <span className="text-gray-300 dark:text-slate-600">|</span>
              <Link
                href="/bg"
                className={`px-2 py-1 rounded transition-colors ${locale === "bg" ? "text-green-700 dark:text-green-400 font-semibold" : "text-gray-500 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400"}`}
              >
                БГ
              </Link>
            </div>

            {/* Theme toggle — desktop */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Mobile hamburger */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
