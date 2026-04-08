import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { routing } from "@/i18n/routing";
import { getAlternates } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: {
      default: "Bulgarian Tourism",
      template: "%s | Bulgarian Tourism",
    },
    description: t("hero_subtitle"),
    alternates: getAlternates(locale, ""),
  };
};

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "bg")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <NextTopLoader color="#15803d" height={2} showSpinner={false} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
