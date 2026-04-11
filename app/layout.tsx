import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer, Header } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getSessionFromCookies } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Online Assessment Platform",
  description: "Online Assessment Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionFromCookies();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.variable)}>
        <ThemeProvider>
          <Header session={session} />

          <main className="bg-[#F7F8F9] dark:bg-background">{children}</main>
          <Toaster position="top-center" />

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
