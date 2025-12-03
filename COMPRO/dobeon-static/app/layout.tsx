import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dobeon - Healthcare & IT Consulting",
  description: "Transforming companies into companies of the future through expert healthcare and IT consulting services.",
  keywords: ["healthcare consulting", "IT consulting", "digital transformation", "healthcare innovation", "enterprise transformation"],
  authors: [{ name: "Dobeon" }],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.jpeg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "Dobeon - Healthcare & IT Consulting",
    description: "Transforming companies into companies of the future through expert healthcare and IT consulting services.",
    type: "website",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
