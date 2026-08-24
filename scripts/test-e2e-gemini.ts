import { analyzeDocumentWithGemini } from "../src/lib/gemini";
import { SummaryLength } from "../src/lib/types";

async function runE2ETest() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("⚠️ GEMINI_API_KEY is not set in environment. Skipping live Gemini API call test.");
    console.log("Set GEMINI_API_KEY in .env.local to run live multimodal API tests.");
    return;
  }

  console.log("=== Running End-to-End Gemini API Tests Across 3 Summary Lengths ===");

  // Simple 1-page sample document image (1x1 transparent PNG data buffer or sample text image)
  const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const mimeType = "image/png";

  const lengths: SummaryLength[] = ["short", "medium", "long"];

  for (const len of lengths) {
    console.log(`\nTesting Gemini API with depth length: '${len}'...`);
    try {
      const startTime = Date.now();
      const result = await analyzeDocumentWithGemini(samplePngBuffer, mimeType, len);
      const duration = Date.now() - startTime;

      console.log(`✅ [${len.toUpperCase()}] Response Received in ${duration}ms:`);
      console.log("Summary:", result.summary.substring(0, 120) + "...");
      console.log("Key Points Count:", result.keyPoints.length);
      console.log("Main Ideas Count:", result.mainIdeas.length);
      console.log("Suggestions Count:", result.improvementSuggestions.length);
    } catch (err: any) {
      console.error(`❌ [${len.toUpperCase()}] Gemini API test failed:`, err?.message || err);
    }
  }

  console.log("\n=== E2E Gemini API Test Completed ===");
}

runE2ETest();
