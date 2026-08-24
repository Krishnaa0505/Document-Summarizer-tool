"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Cpu, Search, CheckCircle2 } from "lucide-react";

const ROTATING_MESSAGES = [
  "Reading document structure & format...",
  "Running multimodal OCR extraction...",
  "Identifying key entities & dates...",
  "Analyzing core arguments & data points...",
  "Structuring insights & summary cards...",
  "Finalizing response with Gemini 2.5...",
];

export const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-10 backdrop-blur-md text-center shadow-xl my-6">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-lg animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-700 shadow-inner">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-400 animate-bounce" />
        Analyzing Document...
      </h3>

      <div className="h-6 overflow-hidden mb-6">
        <p key={messageIndex} className="text-sm text-indigo-300 font-medium transition-all duration-500 animate-fadeIn">
          {ROTATING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="max-w-md mx-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
        <span className="flex items-center gap-1">
          <Search className="h-3.5 w-3.5 text-slate-400" /> Multimodal OCR
        </span>
        <span className="flex items-center gap-1">
          <Cpu className="h-3.5 w-3.5 text-slate-400" /> Serverless API
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Fact Preservation
        </span>
      </div>
    </div>
  );
};
