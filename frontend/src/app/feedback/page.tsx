"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorHandler";

interface Feedback {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  communication_feedback: string;
  technical_feedback: string;
  suggestions: string[];
}

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = Number(searchParams.get("session_id"));

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!sessionId) {
        router.push("/dashboard");
        return;
      }

      try {
        const response = await api.post("/interview/feedback", null, {
          params: {
            session_id: sessionId,
          },
        });
        setFeedback(response.data);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="text-2xl text-gray-600">Loading your feedback...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light">
          <Navbar />
          <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="primary"
                size="lg"
              >
                Back to Dashboard
              </Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!feedback) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="text-2xl text-gray-600">No feedback available</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-900";
    if (score >= 6) return "bg-yellow-100 text-yellow-900";
    return "bg-red-100 text-red-900";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return "🌟";
    if (score >= 6) return "👍";
    return "📈";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Interview Feedback</h1>
            <p className="text-gray-600 text-lg">
              Here's a detailed analysis of your interview performance
            </p>
          </div>

          {/* Overall Score Card */}
          <div className="card p-8 mb-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="text-6xl font-bold gradient-text mb-4">
              {feedback.overall_score}/10 {getScoreBadge(feedback.overall_score)}
            </div>
            <p className="text-gray-600 text-lg">Overall Interview Score</p>
            <div className="mt-6 flex justify-center">
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(feedback.overall_score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💪 Strengths</h2>
              <ul className="space-y-3">
                {feedback.strengths.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <span className="text-xl flex-shrink-0">✅</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📈 Areas for Improvement
              </h2>
              <ul className="space-y-3">
                {feedback.weaknesses.map((weakness, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication Feedback */}
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              💬 Communication Feedback
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {feedback.communication_feedback}
              </p>
            </div>
          </div>

          {/* Technical Feedback */}
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔧 Technical Feedback
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {feedback.technical_feedback}
              </p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="card p-6 mb-12 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Personalized Suggestions
            </h2>
            <ul className="space-y-3">
              {feedback.suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200"
                >
                  <span className="text-xl flex-shrink-0">💡</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/interview-setup")}
              variant="primary"
              size="lg"
              className="px-8"
            >
              Practice Again
            </Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
