import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RakshAI | Emergency guidance when every minute matters",
  description: "AI-assisted emergency assessment and response support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
