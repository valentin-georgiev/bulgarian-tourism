import type { Category } from "@/types/place";

const STYLES: Record<Category, string> = {
  mountain: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  lake: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200",
  cave: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200",
  city: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200",
  fishing: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-200",
  trail: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200",
  beach: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-200",
  museum: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200",
  hiking: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200",
};

type Props = {
  category: Category;
  label: string;
};

export default function Badge({ category, label }: Props) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STYLES[category]}`}
    >
      {label}
    </span>
  );
}
