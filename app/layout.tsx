import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bulgarian Tourism",
  description: "Explore the lakes, mountains, caves, cities, and trails of Bulgaria.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en" className={`h-full ${inter.className}`} suppressHydrationWarning>
    <head>
      {/* Prevent flash of wrong theme on load */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
        }}
      />
      {/* Preconnect to external domains for faster resource loading */}
      <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
      <link
        rel="preconnect"
        href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}
        crossOrigin="anonymous"
      />
    </head>
    <body className="min-h-full flex flex-col antialiased bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
      {children}
    </body>
  </html>
);

export default RootLayout;
