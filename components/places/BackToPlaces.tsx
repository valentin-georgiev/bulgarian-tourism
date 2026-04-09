"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackToPlacesProps = {
  fallbackHref: string;
  label: string;
};

const BackToPlaces = ({ fallbackHref, label }: BackToPlacesProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const referrer = document.referrer;

    try {
      const sameOrigin = referrer && new URL(referrer).origin === window.location.origin;
      const fromPlaces = sameOrigin && new URL(referrer).pathname.includes("/places");

      if (fromPlaces) {
        e.preventDefault();
        router.back();
      }
    } catch {
      // Invalid referrer URL — fall through to default <a> navigation
    }
  };

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </a>
  );
};

export default BackToPlaces;
