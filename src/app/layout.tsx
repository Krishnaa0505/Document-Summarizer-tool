import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocSummary AI - Intelligent Document Analysis & Summarization",
  description:
    "Upload PDF, PNG, JPG, or WEBP documents for instant OCR, key point extraction, and structured AI summarization powered by Google Gemini multimodal API.",
  keywords: ["document summarizer", "OCR", "Gemini API", "PDF summary", "AI document analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />
        {children}
      </body>
    </html>
  );
}
