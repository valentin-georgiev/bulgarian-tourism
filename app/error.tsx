"use client";

const Error = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
      Something Went Wrong
    </h1>
    <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 max-w-md">
      An unexpected error occurred. Please try again.
    </p>
    <button
      onClick={reset}
      className="px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default Error;
