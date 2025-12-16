/**
 * File Info Display Component
 * Displays file name and formatted file size
 */

import React from "react";

interface FileInfoDisplayProps {
  fileName: string;
  fileSize: number;
}

/**
 * Format file size in bytes to human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * File Info Display Component
 * Shows selected file name and size
 */
export const FileInfoDisplay = React.memo(function FileInfoDisplay({
  fileName,
  fileSize,
}: FileInfoDisplayProps) {
  return (
    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <p className="font-medium text-gray-900">Selected file: {fileName}</p>
      <p className="text-gray-600 mt-1">Size: {formatFileSize(fileSize)}</p>
    </div>
  );
});

