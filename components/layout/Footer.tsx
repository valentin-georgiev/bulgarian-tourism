import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-slate-400">
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
