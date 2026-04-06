import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-10">{t("title")}</h1>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {t("mission_title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
          {t("mission_text")}
        </p>
      </section>

      {/* Data Sources */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {t("data_title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{t("data_text")}</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-slate-400">
          <li>{t("data_osm")}</li>
          <li>{t("data_wikidata")}</li>
          <li>{t("data_wikimedia")}</li>
        </ul>
      </section>

      {/* Built With */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {t("tech_title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{t("tech_text")}</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-slate-400">
          <li>{t("tech_nextjs")}</li>
          <li>{t("tech_supabase")}</li>
          <li>{t("tech_typescript")}</li>
          <li>{t("tech_tailwind")}</li>
          <li>{t("tech_leaflet")}</li>
        </ul>
      </section>

      {/* License */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {t("license_title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{t("license_text")}</p>
        <a
          href="https://github.com/valentin-georgiev/bulgarian-tourism"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
        >
          {t("license_github")} &rarr;
        </a>
      </section>

      {/* Privacy */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {t("privacy_title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
          {t("privacy_text")}
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-3">
          {t("disclaimer_title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
          {t("disclaimer_text")}
        </p>
      </section>
    </div>
  );
}
