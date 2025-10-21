import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn PM",
  description: "Project Management Learning App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
