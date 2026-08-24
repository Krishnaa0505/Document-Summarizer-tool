export type SummaryLength = "short" | "medium" | "long";

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  mainIdeas: string[];
  improvementSuggestions: string[];
}

export interface SummarizeApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export interface FileDetails {
  name: string;
  size: number;
  type: string;
  file: File;
}
