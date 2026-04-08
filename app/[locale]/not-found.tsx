import Link from "next/link";
import { getTranslations } from "next-intl/server";

const LocaleNotFound = async () => {
  const t = await getTranslations("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-green-700 dark:text-green-400 mb-4">404</h1>
      <p className="text-xl text-gray-700 dark:text-slate-300 mb-2">{t("not_found_title")}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 max-w-md">
        {t("not_found_text")}
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
        >
          {t("go_home")}
        </Link>
        <Link
          href="/places"
          className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          {t("browse_places")}
        </Link>
      </div>
    </div>
  );
};

export default LocaleNotFound;
