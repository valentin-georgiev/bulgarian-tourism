"use client";

import { useSyncExternalStore, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  /* Listen for class changes on <html> from other sources */
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg text-gray-500 hover:text-green-700 dark:text-slate-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
