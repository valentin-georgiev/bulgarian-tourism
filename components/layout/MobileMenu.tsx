"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useActiveLink } from "@/lib/useActiveLink";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const { linkClass } = useActiveLink("mobile");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

      {/* Portal overlay — rendered at document.body to escape header's backdrop-filter stacking context */}
      {open &&
        createPortal(
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={close} />

            {/* Menu panel */}
            <div className="fixed top-16 left-0 right-0 z-5000 sm:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-lg animate-slide-up">
              <nav className="flex flex-col px-4 py-4 gap-1">
                <Link href={`/${locale}`} onClick={close} className={linkClass(`/${locale}`)}>
                  {t("home")}
                </Link>
                <Link
                  href={`/${locale}/places`}
                  onClick={close}
                  className={linkClass(`/${locale}/places`)}
                >
                  {t("places")}
                </Link>
                <Link
                  href={`/${locale}/map`}
                  onClick={close}
                  className={linkClass(`/${locale}/map`)}
                >
                  {t("map")}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  onClick={close}
                  className={linkClass(`/${locale}/about`)}
                >
                  {t("about")}
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  onClick={close}
                  className={linkClass(`/${locale}/faq`)}
                >
                  {t("faq")}
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
          </>,
          document.body
        )}
    </>
  );
};

export default MobileMenu;
