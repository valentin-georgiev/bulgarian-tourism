import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

type LinkVariant = "navbar" | "mobile" | "footer";

const activeStyles: Record<LinkVariant, string> = {
  navbar:
    "text-green-700 dark:text-green-400 font-semibold transition-colors",
  mobile:
    "px-3 py-2.5 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 transition-colors",
  footer:
    "text-green-700 dark:text-green-400 font-semibold transition-colors",
};

const inactiveStyles: Record<LinkVariant, string> = {
  navbar:
    "hover:text-green-700 dark:hover:text-green-400 transition-colors",
  mobile:
    "px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors",
  footer:
    "hover:text-green-700 dark:hover:text-green-400 transition-colors",
};

export function useActiveLink(variant: LinkVariant) {
  const pathname = usePathname();
  const locale = useLocale();

  const isActive = (href: string) => {
    const path = pathname.replace(`/${locale}`, "") || "/";
    const target = href.replace(`/${locale}`, "") || "/";
    return target === "/" ? path === "/" : path.startsWith(target);
  };

  const linkClass = (href: string) =>
    isActive(href) ? activeStyles[variant] : inactiveStyles[variant];

  return { isActive, linkClass };
}
