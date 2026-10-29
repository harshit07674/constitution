import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Constitution — Know what you stand for. Live like you mean it.",
  description:
    "A private digital workspace to define your core values, author personal principles and boundaries, and maintain decision alignment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-brass)]/20 selection:text-[var(--color-forest)]">
        {children}
      </body>
    </html>
  );
}
