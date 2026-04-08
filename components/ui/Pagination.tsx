import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "@/types/components";

const getPageNumbers = (current: number, total: number): (number | null)[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | null)[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push(null);
    }
    result.push(sorted[i]);
  }

  return result;
};

const activeClass =
  "bg-green-700 text-white border-green-700 dark:bg-green-600 dark:border-green-600";
const inactiveClass =
  "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-green-400";
const disabledClass =
  "bg-gray-50 dark:bg-slate-800/50 text-gray-300 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed";
const baseClass =
  "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-3 rounded-full text-sm font-medium border transition-colors";

const Pagination = ({ currentPage, totalPages, baseParams, labels }: PaginationProps) => {
  const buildHref = (page: number): string => {
    const params = new URLSearchParams(baseParams);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label={labels.page}
      className="mt-12 flex flex-wrap justify-center items-center gap-2"
    >
      {/* Previous */}
      {currentPage === 1 ? (
        <span className={`${baseClass} ${disabledClass}`} aria-disabled="true">
          <ChevronLeft className="w-4 h-4 mr-1" />
          {labels.previous}
        </span>
      ) : (
        <a
          href={buildHref(currentPage - 1)}
          className={`${baseClass} ${inactiveClass}`}
          aria-label={`${labels.previous} ${labels.page}`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {labels.previous}
        </a>
      )}

      {/* Page numbers */}
      {pages.map((page, _i, arr) => {
        const key = page === null ? `ellipsis-after-${arr[_i - 1]}` : page;
        return page === null ? (
          <span
            key={key}
            className="inline-flex items-center justify-center min-w-[2.25rem] h-9 text-sm text-gray-400 dark:text-slate-500"
          >
            ...
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className={`${baseClass} ${activeClass}`}
            aria-current="page"
            aria-label={`${labels.page} ${page}`}
          >
            {page}
          </span>
        ) : (
          <a
            key={page}
            href={buildHref(page)}
            className={`${baseClass} ${inactiveClass}`}
            aria-label={`${labels.page} ${page}`}
          >
            {page}
          </a>
        );
      })}

      {/* Next */}
      {currentPage === totalPages ? (
        <span className={`${baseClass} ${disabledClass}`} aria-disabled="true">
          {labels.next}
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      ) : (
        <a
          href={buildHref(currentPage + 1)}
          className={`${baseClass} ${inactiveClass}`}
          aria-label={`${labels.next} ${labels.page}`}
        >
          {labels.next}
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      )}
    </nav>
  );
};

export default Pagination;
