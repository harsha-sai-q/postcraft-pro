import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostCraft Pro",
  description: "AI-powered LinkedIn post generator"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
