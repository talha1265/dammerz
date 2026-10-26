import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dammerz AI — Autonomous Business AI Agents & Operations Platform",
  description: "Enterprise platform to deploy WhatsApp & Voice AI Agents for Employee Operations, IndiaMart & Google Sales, Tender Management, and Autonomous Calling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
