"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger button — visible only below sm */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-1.5 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={t("menu")}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={close} />

          {/* Menu panel */}
          <div className="fixed top-16 left-0 right-0 z-50 sm:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-lg animate-slide-up">
            <nav className="flex flex-col px-4 py-4 gap-1">
              <Link
                href={`/${locale}`}
                onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/places`}
                onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t("places")}
              </Link>
              <Link
                href={`/${locale}/map`}
                onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t("map")}
              </Link>

              <hr className="my-2 border-gray-200 dark:border-slate-700" />

              <div className="flex items-center justify-between px-3 py-2">
                {/* Language switcher */}
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Link
                    href="/en"
                    onClick={close}
                    className={`px-2 py-1 rounded transition-colors ${
                      locale === "en"
                        ? "text-green-700 dark:text-green-400 font-semibold"
                        : "text-gray-500 dark:text-slate-400 hover:text-green-700"
                    }`}
                  >
                    EN
                  </Link>
                  <span className="text-gray-300 dark:text-slate-600">|</span>
                  <Link
                    href="/bg"
                    onClick={close}
                    className={`px-2 py-1 rounded transition-colors ${
                      locale === "bg"
                        ? "text-green-700 dark:text-green-400 font-semibold"
                        : "text-gray-500 dark:text-slate-400 hover:text-green-700"
                    }`}
                  >
                    БГ
                  </Link>
                </div>

                <ThemeToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;
