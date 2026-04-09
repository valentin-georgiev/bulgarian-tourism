"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

type Option = { value: string; label: string };

type SelectDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  searchPlaceholder?: string;
};

const SelectDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Search…",
}: SelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  // All options including the "clear" option
  const allOptions: Option[] = [{ value: "", label: placeholder }, ...options];

  const filtered = search
    ? allOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : allOptions;

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Focus search when opened
  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighlightedIndex(-1);
    }
  }, [open]);

  const select = useCallback(
    (option: Option) => {
      onChange(option.value);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const items = listRef.current.children;
    if (items[highlightedIndex]) {
      (items[highlightedIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSearch("");
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          select(filtered[highlightedIndex]);
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative ml-auto" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
          value
            ? "bg-green-700 text-white border-green-700"
            : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-green-400"
        } focus:outline-none focus:ring-2 focus:ring-green-400`}
      >
        <span className="truncate max-w-[160px]">{value ? selectedLabel : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl shadow-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-slate-700">
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(-1);
              }}
              placeholder={searchPlaceholder}
              className="w-full text-sm bg-transparent text-gray-700 dark:text-slate-300 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Options */}
          <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500">No results</li>
            ) : (
              filtered.map((option, idx) => {
                const isSelected = option.value === value;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li
                    key={option.value || "__clear__"}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => select(option)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                      isHighlighted ? "bg-gray-100 dark:bg-slate-700" : ""
                    } ${
                      isSelected
                        ? "text-green-700 dark:text-green-400 font-medium"
                        : "text-gray-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
