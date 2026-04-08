"use client";

const GlobalError = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => (
  <html lang="en" className="h-full">
    <body className="min-h-full flex flex-col antialiased bg-white text-gray-900">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-md">
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </body>
  </html>
);

export default GlobalError;
