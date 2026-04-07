import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
    description: t("meta_description"),
    alternates: getAlternates(locale, "/faq"),
  };
}

type FAQItem = { question: string; answer: string };
type FAQSection = { title: string; items: FAQItem[] };

export default async function FAQPage() {
  const t = await getTranslations("faq");

  const sections: FAQSection[] = [
    {
      title: t("section_about"),
      items: [
        { question: t("q_what_is"), answer: t("a_what_is") },
        { question: t("q_data_source"), answer: t("a_data_source") },
        { question: t("q_is_free"), answer: t("a_is_free") },
      ],
    },
    {
      title: t("section_travel"),
      items: [
        { question: t("q_best_time"), answer: t("a_best_time") },
        { question: t("q_visa"), answer: t("a_visa") },
        { question: t("q_currency"), answer: t("a_currency") },
      ],
    },
    {
      title: t("section_using"),
      items: [
        { question: t("q_find_near_me"), answer: t("a_find_near_me") },
        { question: t("q_report_error"), answer: t("a_report_error") },
        { question: t("q_offline"), answer: t("a_offline") },
      ],
    },
  ];

  const allItems = sections.flatMap((s) => s.items);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-10">{t("title")}</h1>

      {sections.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-4">
            {section.title}
          </h2>

          <div className="space-y-3">
            {section.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-gray-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  {item.question}
                  <span className="ml-4 shrink-0 text-gray-400 dark:text-slate-500 transition-transform group-open:rotate-180">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
