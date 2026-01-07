"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import api from "@/lib/api";
import { setResumeId } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorHandler";

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      setResumeId(response.data.resume_id);
      router.push("/interview-setup");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Upload Your Resume</h1>
            <p className="text-gray-600 text-lg">
              Upload a PDF file to get personalized interview questions based on your experience.
            </p>
          </div>

          <div className="card p-12">
            <form onSubmit={handleUpload} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition cursor-pointer"
                onClick={() => document.getElementById("file-input")?.click()}>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </h3>
                <p className="text-gray-600">PDF (Max 10MB)</p>
              </div>

              {/* Progress Bar */}
              {progress > 0 && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              {/* Upload Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!file}
                className="w-full"
              >
                Upload Resume
              </Button>
            </form>

            {/* Tips */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">📝 Tips for best results:</h4>
              <ul className="text-blue-800 space-y-2">
                <li>• Use a clear, well-formatted resume</li>
                <li>• Include your skills, experience, and projects</li>
                <li>• Make sure the PDF is readable and not corrupted</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
