import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SoundLayer } from "@/components/sound-layer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Absolute URLs for share images: the production domain on Vercel, or a
// SITE_URL set by hand, falling back to local development.
const siteUrl = process.env.SITE_URL
  ? process.env.SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

const description =
  "Rama Krushna Behera, a creative technologist building things between the digital and the physical: LED matrices, pen plotters, installations and the code behind them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "rkdotxyz — Creative Technologist",
  description,
  openGraph: {
    type: "website",
    siteName: "rkdotxyz",
    title: "rkdotxyz — Creative Technologist",
    description,
  },
  twitter: { card: "summary_large_image", creator: "@rkdotxyz" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* clip (not hidden) so the sticky header keeps working */}
        <div className="flex min-h-full flex-col overflow-x-clip">{children}</div>
        <SoundLayer />
      </body>
    </html>
  );
}
