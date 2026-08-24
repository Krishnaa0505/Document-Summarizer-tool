"use client";

import React from "react";
import { SummaryLength } from "@/lib/types";
import { Zap, AlignLeft, FileText } from "lucide-react";

interface LengthSelectorProps {
  selectedLength: SummaryLength;
  onSelectLength: (length: SummaryLength) => void;
}

const LENGTH_OPTIONS: {
  id: SummaryLength;
  label: string;
  description: string;
  badge: string;
  icon: React.ElementType;
}[] = [
  {
    id: "short",
    label: "Executive Short",
    description: "3 - 5 concise sentences highlighting the absolute core facts.",
    badge: "Quick Read",
    icon: Zap,
  },
  {
    id: "medium",
    label: "Balanced Medium",
    description: "1 - 3 structured paragraphs covering main themes and key points.",
    badge: "Recommended",
    icon: AlignLeft,
  },
  {
    id: "long",
    label: "Comprehensive Long",
    description: "In-depth structured breakdown with full context and suggestions.",
    badge: "Detailed",
    icon: FileText,
  },
];

export const LengthSelector: React.FC<LengthSelectorProps> = ({
  selectedLength,
  onSelectLength,
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Select Summary Detail Level
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LENGTH_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLength === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectLength(option.id)}
              className={`relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 text-slate-100 ring-1 ring-indigo-500/50"
                  : "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {option.badge}
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-1">{option.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
