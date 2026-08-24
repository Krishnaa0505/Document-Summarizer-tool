import { validateFile, MAX_FILE_SIZE_BYTES } from "../src/lib/validators";

console.log("=== Running File Validation Tests ===");

// Test 1: Empty file
const emptyTest = validateFile({ name: "empty.pdf", size: 0, type: "application/pdf" });
console.log("Test 1 - Empty File Rejection:", !emptyTest.valid ? "PASSED" : "FAILED", `(${emptyTest.error})`);

// Test 2: Invalid file extension/type
const invalidTypeTest = validateFile({ name: "script.exe", size: 1000, type: "application/x-msdownload" });
console.log("Test 2 - Invalid Type Rejection:", !invalidTypeTest.valid ? "PASSED" : "FAILED", `(${invalidTypeTest.error})`);

// Test 3: Oversized file (> 4.5MB)
const oversizedTest = validateFile({ name: "large_doc.pdf", size: MAX_FILE_SIZE_BYTES + 1024, type: "application/pdf" });
console.log("Test 3 - Oversized File Rejection:", !oversizedTest.valid ? "PASSED" : "FAILED", `(${oversizedTest.error})`);

// Test 4: Valid PDF file
const validPdfTest = validateFile({ name: "sample_doc.pdf", size: 1024 * 500, type: "application/pdf" });
console.log("Test 4 - Valid PDF Acceptance:", validPdfTest.valid ? "PASSED" : "FAILED");

// Test 5: Valid Image file
const validImgTest = validateFile({ name: "receipt.png", size: 1024 * 800, type: "image/png" });
console.log("Test 5 - Valid PNG Acceptance:", validImgTest.valid ? "PASSED" : "FAILED");

if (!emptyTest.valid && !invalidTypeTest.valid && !oversizedTest.valid && validPdfTest.valid && validImgTest.valid) {
  console.log("\nALL VALIDATION TESTS PASSED SUCCESSFULLY! ✅");
} else {
  console.error("\nSOME VALIDATION TESTS FAILED! ❌");
  process.exit(1);
}
