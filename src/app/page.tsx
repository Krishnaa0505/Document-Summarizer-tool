"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { LengthSelector } from "@/components/LengthSelector";
import { LoadingState } from "@/components/LoadingState";
import { SummaryResults } from "@/components/SummaryResults";
import { FileDetails, SummaryLength, AnalysisResult, SummarizeApiResponse } from "@/lib/types";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<FileDetails | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a valid document to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile.file);
    formData.append("length", summaryLength);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data: SummarizeApiResponse = await response.json();

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || "Unable to analyze this document right now.");
      }

      setResult(data.data);
    } catch (err: any) {
      console.error("[Client Analysis Error]:", err);
      setError(err?.message || "Unable to analyze this document right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!result ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Gemini Multimodal OCR & Summarization
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                Transform any document into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  actionable structured insights
                </span>
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Upload PDFs, PNGs, or JPEGs. Extracts text via multimodal AI, generates executive summaries, key points, main ideas, and improvement suggestions.
              </p>
            </div>

            {/* Main Interactive Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              {/* File Upload Zone */}
              <FileUpload
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                error={error}
                setError={setError}
              />

              {/* Length Selector */}
              {selectedFile && !loading && (
                <div className="pt-4 border-t border-slate-800/80 animate-fadeIn space-y-6">
                  <LengthSelector
                    selectedLength={summaryLength}
                    onSelectLength={setSummaryLength}
                  />

                  <button
                    onClick={handleAnalyze}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.005] active:scale-[0.995] transition-all"
                  >
                    <span>Analyze & Summarize Document</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && <LoadingState />}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-slate-400 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Zero Persistence — Files processed in-memory only</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Instant Multimodal OCR via Gemini AI</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <Sparkles className="h-4 w-4 text-pink-400 shrink-0" />
                <span>Structured JSON Output & Export options</span>
              </div>
            </div>
          </div>
        ) : (
          <SummaryResults
            result={result}
            fileName={selectedFile?.name || "Uploaded Document"}
            summaryLength={summaryLength}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        DocSummary AI • Built with Next.js, Tailwind CSS & Google Gemini Multimodal API
      </footer>
    </div>
  );
}
