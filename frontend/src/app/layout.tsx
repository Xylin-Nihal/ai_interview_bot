import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewAI - AI-Powered Interview Preparation",
  description: "Prepare for your interviews with AI-powered feedback and guidance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-light text-gray-900">{children}</body>
    </html>
  );
}
