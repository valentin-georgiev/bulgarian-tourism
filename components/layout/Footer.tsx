import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-slate-400">
          <p>{t("tagline")}</p>
          <nav className="flex items-center gap-4">
            <Link
              href={`/${locale}/about`}
              className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              {t("faq")}
            </Link>
            <a
              href="https://github.com/valentin-georgiev/bulgarian-tourism"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              {t("github")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
