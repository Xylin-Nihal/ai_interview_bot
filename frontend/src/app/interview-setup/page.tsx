"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import api from "@/lib/api";
import { getResumeId, setSessionId } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorHandler";

type InterviewType = "Technical" | "HR" | "Aptitude";

export default function InterviewSetupPage() {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const resumeId = getResumeId();

  const interviewTypes = [
    {
      id: "Technical",
      title: "Technical Interview",
      description: "Test your coding and technical problem-solving skills",
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "HR",
      title: "HR Interview",
      description: "Practice common HR questions and behavioral interviews",
      icon: "👔",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "Aptitude",
      title: "Aptitude Interview",
      description: "Test your logical reasoning and analytical skills",
      icon: "🧠",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const handleStartInterview = async () => {
    if (!selectedType || !resumeId) {
      setError("Please select an interview type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/interview-session/start", {
        resume_id: resumeId,
        interview_type: selectedType,
      });

      // Store interview type in session storage
      sessionStorage.setItem("interviewType", selectedType);
      
      setSessionId(response.data.session_id);
      router.push(`/interview?session_id=${response.data.session_id}&interview_type=${selectedType}`);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!resumeId) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light">
          <Navbar />
          <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Required</h2>
              <p className="text-gray-600 mb-6">
                Please upload a resume before starting an interview.
              </p>
              <Button
                onClick={() => router.push("/resume-upload")}
                variant="primary"
                size="lg"
              >
                Upload Resume
              </Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Select Interview Type</h1>
            <p className="text-gray-600 text-lg">
              Choose the type of interview you want to practice. Our AI will ask relevant questions based on your resume.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Interview Type Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {interviewTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id as InterviewType)}
                className={`card p-8 cursor-pointer transition-all duration-300 ${
                  selectedType === type.id
                    ? "ring-2 ring-primary shadow-2xl"
                    : ""
                }`}
              >
                <div className="text-6xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {type.id === selectedType ? "✓ Selected" : "Select"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Start Button */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={handleStartInterview}
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!selectedType}
              className="px-8"
            >
              Start Interview
            </Button>
          </div>

          {/* Interview Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="text-3xl font-bold gradient-text mb-2">5</div>
              <p className="text-gray-600">Main Questions</p>
            </div>
            <div className="card p-6">
              <div className="text-3xl font-bold gradient-text mb-2">3-5</div>
              <p className="text-gray-600">Follow-up Questions</p>
            </div>
            <div className="card p-6">
              <div className="text-3xl font-bold gradient-text mb-2">📊</div>
              <p className="text-gray-600">Detailed Feedback</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
