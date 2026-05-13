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
        <link rel="preload" as="image" href="/assets/ify-portrait.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
