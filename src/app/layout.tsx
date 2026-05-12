import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vibe Coding - Build Apps with AI",
  description: "Describe what you want. AI builds it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
