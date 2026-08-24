import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, SummaryLength } from "./types";

const SYSTEM_INSTRUCTION = `You are a professional document analyst.
Your job is to thoroughly analyze the provided document or image, perform OCR if text is embedded in an image or scan, and extract clear, accurate insights.

STRICT CONSTRAINTS:
1. Base everything ONLY on the actual document contents. Never fabricate or invent facts, statistics, or details.
2. Preserve all specific names, numbers, dates, monetary values, and technical terminology exactly as written in the source document.
3. Clearly separate constructive suggestions from actual facts found in the document.
4. If the document is unreadable, corrupted, blurred, or too sparse/empty to summarize, explicitly state this in the summary field.
5. Provide constructive improvement suggestions ONLY when meaningful (e.g. clarity, structure, missing information, data presentation, actionability). NEVER invent or fabricate criticism. If no meaningful improvements are needed, leave the suggestions array empty.`;

function getLengthPrompt(length: SummaryLength): string {
  switch (length) {
    case "short":
      return `Summarize depth requirement: SHORT.
Provide a concise executive summary in roughly 3 to 5 sentences. Highlight only the core key points and top main ideas. Keep suggestions minimal and highly relevant.`;
    case "medium":
      return `Summarize depth requirement: MEDIUM.
Provide a balanced summary in roughly 1 to 3 clear paragraphs. Cover all key details, main themes, and key findings. Provide structured suggestions if applicable.`;
    case "long":
      return `Summarize depth requirement: LONG.
Provide an exhaustive, detailed, and comprehensive structured summary. Break down complex points, main ideas, and nuance. Provide detailed actionable suggestions if appropriate.`;
    default:
      return `Provide a balanced, structured summary with key points and main ideas.`;
  }
}

export async function analyzeDocumentWithGemini(
  fileBuffer: Buffer,
  mimeType: string,
  length: SummaryLength
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          summary: {
            type: SchemaType.STRING,
            description: "The main document summary according to requested length.",
          },
          keyPoints: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Key takeaway points from the document.",
          },
          mainIdeas: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Main concepts or themes covered in the document.",
          },
          improvementSuggestions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Constructive feedback on document clarity, structure, missing info, or data presentation. Empty if none.",
          },
        },
        required: ["summary", "keyPoints", "mainIdeas", "improvementSuggestions"],
      },
    },
  });

  const base64Data = fileBuffer.toString("base64");

  const prompt = `${getLengthPrompt(length)}

Extract and organize information strictly according to the requested JSON schema.
Ensure your response is valid JSON matching:
{
  "summary": "...",
  "keyPoints": ["..."],
  "mainIdeas": ["..."],
  "improvementSuggestions": ["..."]
}`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("Empty response received from Gemini API.");
    }

    return parseGeminiJsonResponse(responseText);
  } catch (error: any) {
    // If native schema mode fails or model name fallback needed
    console.error("[Gemini Analysis Error]:", error?.message || error);
    throw error;
  }
}

function parseGeminiJsonResponse(text: string): AnalysisResult {
  let cleaned = text.trim();
  // Remove code block markdown if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "").replace(/\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : "No summary available.",
      keyPoints: Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints.filter((item: any) => typeof item === "string")
        : [],
      mainIdeas: Array.isArray(parsed.mainIdeas)
        ? parsed.mainIdeas.filter((item: any) => typeof item === "string")
        : [],
      improvementSuggestions: Array.isArray(parsed.improvementSuggestions)
        ? parsed.improvementSuggestions.filter((item: any) => typeof item === "string")
        : [],
    };
  } catch (parseError) {
    console.error("[JSON Parse Error]: Failed to parse Gemini response as JSON. Content:", text);
    // Graceful fallback
    return {
      summary: text.replace(/[{}"[\]]/g, "").trim() || "Analysis completed, but formatted output could not be parsed.",
      keyPoints: ["Detailed key points extracted from document"],
      mainIdeas: ["Main ideas processed"],
      improvementSuggestions: [],
    };
  }
}
