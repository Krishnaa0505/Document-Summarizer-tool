"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File, X, AlertCircle, Image as ImageIcon, FileText } from "lucide-react";
import { validateFile, formatFileSize, MAX_FILE_SIZE_MB } from "@/lib/validators";
import { FileDetails } from "@/lib/types";

interface FileUploadProps {
  onFileSelect: (fileDetails: FileDetails | null) => void;
  selectedFile: FileDetails | null;
  error: string | null;
  setError: (error: string | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  error,
  setError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) {
      onFileSelect(null);
      return;
    }

    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      setError(validation.error || "Invalid file.");
      onFileSelect(null);
      return;
    }

    onFileSelect({
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.startsWith("image/") || /\.(png|jpg|jpeg|webp)$/i.test(name)) {
      return <ImageIcon className="h-8 w-8 text-pink-400" />;
    }
    return <FileText className="h-8 w-8 text-indigo-400" />;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
        id="file-upload-input"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
              : "border-slate-700 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/80"
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20 shadow-inner">
            <UploadCloud className="h-8 w-8" />
          </div>

          <h3 className="text-base font-semibold text-slate-100 mb-1">
            Drag & drop your document here
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            or <span className="text-indigo-400 font-medium hover:underline">browse file</span> from your computer
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              PDF
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              PNG
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              JPG / JPEG
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              WEBP
            </span>
            <span className="text-slate-500">•</span>
            <span>Max file size: <strong className="text-slate-300">{MAX_FILE_SIZE_MB} MB</strong></span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg flex items-center justify-between transition-all">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
              {getFileIcon(selectedFile.type, selectedFile.name)}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-slate-400">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || "Document"}
              </p>
            </div>
          </div>

          <button
            onClick={handleRemoveFile}
            type="button"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center space-x-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
