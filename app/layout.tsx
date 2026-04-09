import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer, Header } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Online Assessment Platform",
  description: "Online Assessment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.variable)}>
        <ThemeProvider>
          <Header />

          <main className="bg-[#F7F8F9] dark:bg-background">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
