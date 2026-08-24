import React from "react";
import { FileText, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              DocSummary AI
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Gemini Multimodal
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Instant OCR, structured analysis & intelligent document summarization
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400 animate-pulse" />
            No Storage • Serverless
          </span>
        </div>
      </div>
    </header>
  );
};
