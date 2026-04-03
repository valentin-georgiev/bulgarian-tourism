import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bulgarian Tourism",
  description: "Explore the lakes, mountains, caves, cities, and trails of Bulgaria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
