import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DayliCarbs",
  description: "Track your daily carbohydrate intake",
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body className="bg-neutral-950 text-neutral-50">
        <div className="max-w-md mx-auto flex flex-col min-h-screen">
          <header className="flex items-center justify-between p-4 border-b border-neutral-800">
            <Link href="/" className="text-xl font-bold text-emerald-500">
              DayliCarbs
            </Link>
            <Link
              href="/history"
              className="text-sm text-neutral-400 hover:text-neutral-200"
            >
              History
            </Link>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
