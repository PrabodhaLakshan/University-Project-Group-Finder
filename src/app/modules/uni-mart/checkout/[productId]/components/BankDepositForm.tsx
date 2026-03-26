"use client";

import { useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

interface BankDepositFormProps {
  onSubmit: (file: File) => Promise<void>;
  isProcessing: boolean;
}

export default function BankDepositForm({
  onSubmit,
  isProcessing,
}: BankDepositFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a receipt image");
      return;
    }

    try {
      await onSubmit(selectedFile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload receipt"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Upload Bank Deposit Receipt
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Bank Deposit Instructions (Demo Only):</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Use sample/test data only</li>
            <li>Do not use a real bank transfer</li>
            <li>Upload any demo screenshot image as a receipt</li>
            <li>Submit to continue testing the checkout flow</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label
            htmlFor="receipt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Receipt Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer"
            onClick={() => document.getElementById("receipt")?.click()}>
            {preview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="max-h-40 rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile?.size || 0) / 1024 > 1024
                      ? ((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2) +
                        " MB"
                      : ((selectedFile?.size || 0) / 1024).toFixed(2) + " KB"}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">
                  Click to upload receipt
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
          <input
            id="receipt"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !selectedFile}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
        >
          {isProcessing ? "Processing..." : "Confirm Order & Upload Receipt"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Demo mode: upload a sample image only. No real money transfer is required.
      </p>
    </form>
  );
}
