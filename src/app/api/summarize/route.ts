import { NextRequest, NextResponse } from "next/server";
import { validateFile } from "@/lib/validators";
import { analyzeDocumentWithGemini } from "@/lib/gemini";
import { SummaryLength, SummarizeApiResponse } from "@/lib/types";

export const maxDuration = 60; // 60 seconds max duration for Vercel serverless execution

export async function POST(req: NextRequest): Promise<NextResponse<SummarizeApiResponse>> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const length = (formData.get("length") as SummaryLength) || "medium";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No document file was provided." },
        { status: 400 }
      );
    }

    // Validate length parameter
    const validLengths: SummaryLength[] = ["short", "medium", "long"];
    const summaryLength: SummaryLength = validLengths.includes(length) ? length : "medium";

    // Server-side file validation
    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || "Invalid file uploaded." },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine correct MIME type (fallback based on extension if file.type is blank)
    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") mimeType = "application/pdf";
      else if (ext === "png") mimeType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
      else if (ext === "webp") mimeType = "image/webp";
    }

    // Call Gemini API
    const result = await analyzeDocumentWithGemini(buffer, mimeType, summaryLength);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    // Log details ONLY on server side. Never log file content or API key.
    console.error("[API /api/summarize Error]:", error?.message || error);

    // User-facing generic error message to protect internal API error details
    const userErrorMessage =
      error?.message === "GEMINI_API_KEY environment variable is missing."
        ? "Gemini API key is not configured on the server."
        : "Unable to analyze this document right now. Please check the file and try again.";

    return NextResponse.json(
      {
        success: false,
        error: userErrorMessage,
      },
      { status: 500 }
    );
  }
}
