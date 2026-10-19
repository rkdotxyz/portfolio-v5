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

export const metadata: Metadata = {
  title: "rkdotxyz — Creative Technologist",
  description:
    "Portfolio of Rama Krushna Behera, a senior product designer turning creative technologist.",
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
