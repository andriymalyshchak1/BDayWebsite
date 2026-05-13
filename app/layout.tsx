import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday, Ify",
  description: "A personal birthday experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets so they're ready when each screen mounts */}
        <link rel="preload" as="image" href="/assets/ify-portrait.png" />
        <link rel="preload" as="video" href="/assets/castle-intro-compressed.mp4" type="video/mp4" />
      </head>
      <body>{children}</body>
    </html>
  );
}
