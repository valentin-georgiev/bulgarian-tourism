import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-green-700 dark:text-green-400 mb-4">404</h1>
      <p className="text-xl text-gray-700 dark:text-slate-300 mb-2">Page Not Found</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/en"
          className="px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/en/places"
          className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          Browse Places
        </Link>
      </div>
    </div>
  );
}
