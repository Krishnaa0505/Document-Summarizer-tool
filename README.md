# DocSummary AI — Document Summary Assistant

An AI-powered document summary assistant built with Next.js (App Router), TypeScript, Tailwind CSS, and the Google Gemini Multimodal API. Upload PDFs, PNGs, JPGs, or WEBP files to receive instant OCR, key point extraction, main ideas, and structured improvement feedback.

---

## Technical Approach - (WRITE UP)

DocSummary AI leverages Google Gemini’s multimodal architecture (`gemini-2.5-flash`) to eliminate separate OCR engines and pipeline bottlenecks. When a document or image is uploaded, it is validated client-side for type and size (max 4.5MB for Vercel payload compatibility) and transmitted securely via standard Next.js App Router POST API handlers.

On the server, the raw file buffer is passed directly to Gemini's multimodal API alongside strict system instructions enforcing zero-hallucination fact preservation, verbatim terminology adherence, and structured JSON output mode (`responseSchema`). The prompt dynamically adapts to the user's chosen summary depth (Short, Medium, or Long).

The response is validated against a structured TypeScript schema on receipt, ensuring graceful fallbacks if parsing anomalies occur. Uploaded files remain transient in memory without server storage or database persistence, guaranteeing speed, privacy, and zero data footprint.

---

## Architecture Overview

```
[ Client Browser ]
       │
       ├── 1. Drag & Drop File Picker (PDF, PNG, JPG, WEBP)
       ├── 2. Client-side Validation (Type check + 4.5MB size limit)
       ├── 3. Summary Detail Selector (Short / Medium / Long)
       │
       ▼ (FormData Payload)
[ Next.js API Route: /api/summarize ]
       │
       ├── 4. Server Validation & Security Check
       ├── 5. Buffer Encoding & Gemini Multimodal Payload Construction
       │
       ▼ (In-Memory Transmittal)
[ Google Gemini 2.5 Multimodal API ]
       │
       ├── 6. Native Multimodal OCR & Document Analysis
       ├── 7. Strict JSON Schema Response Generation
       │
       ▼ (Structured JSON Result)
[ Dashboard UI Cards ]
       ├── Executive Summary Card
       ├── Bulleted Key Points & Main Ideas Cards
       ├── Actionable Improvement Suggestions
       └── Export & Copy Options (.MD / .JSON / Clipboard)
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18.x or higher
- A Google Gemini API Key (Obtain free from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd document-summarizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and paste your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Your Google AI Studio API key | Yes | None |
| `GEMINI_MODEL` | Gemini model variant to use | No | `gemini-2.5-flash` |

---

## Deployment Notes (Vercel)

This application is production-ready for deployment on **Vercel**:

1. Push your code to a GitHub/GitLab repository.
2. Import the project into Vercel.
3. Under **Environment Variables** in Vercel settings, add `GEMINI_API_KEY` and optional `GEMINI_MODEL`.
4. Deploy! Next.js App Router and standard serverless handlers require no extra build steps (`npm run build` passes cleanly).

> **Note on File Limits:** Vercel serverless payload limits cap request bodies at 4.5MB. Client-side and server-side validators automatically reject larger files to prevent payload timeouts.

---

## Known Limitations

- **File Size**: Upload limit is set to 4.5 MB to comply with serverless execution boundaries.
- **Multipage PDFs**: Very large PDFs (>50 pages) may take longer to process within serverless execution timeouts (max 60s).
- **Data Persistence**: No database or storage bucket is used; summary results are maintained in client state for the current session.

---

## Verification & Testing

Run automated build and validation tests:

```bash
# Run Next.js production build check
npm run build

# Run file validation rejection test suite
npx tsx scripts/test-validation.ts

# Run E2E Gemini API test (requires GEMINI_API_KEY in environment)
npx tsx scripts/test-e2e-gemini.ts
```
