import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextAuth JWT Authentication",
  description: "Next.js Authentication with NextAuth.js and JWT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
