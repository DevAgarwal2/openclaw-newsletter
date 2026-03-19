import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "OpenClaw Updates",
  description: "AI-generated summaries of every OpenClaw release. Built for agents and their operators. Get Reddit-style changelogs that explain what actually matters.",
  keywords: ["OpenClaw", "release notes", "AI", "agents", "changelog", "automation", "monitoring"],
  authors: [{ name: "OpenClaw Updates" }],
  creator: "OpenClaw Updates",
  publisher: "OpenClaw Updates",
  robots: "index, follow",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "OpenClaw Updates",
    description: "AI-generated summaries of every OpenClaw release. Built for agents and their operators.",
    url: "https://openclaw-newsletter-agent.vercel.app",
    siteName: "OpenClaw Updates",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://openclaw-newsletter-agent.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenClaw Updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw Updates",
    description: "AI-generated summaries of every OpenClaw release. Built for agents and their operators.",
    images: ["https://openclaw-newsletter-agent.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://openclaw-newsletter-agent.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦞</text></svg>" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased bg-[#faf9f7] text-[#1a1a1a]`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
