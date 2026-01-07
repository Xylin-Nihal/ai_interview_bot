"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import api from "@/lib/api";

interface User {
  id: number;
  full_name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-light">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="text-2xl text-gray-600">Loading...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Welcome, {user?.full_name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Ready to master your next interview? Choose how you'd like to proceed.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Resume Card */}
            <Link href="/resume-upload">
              <div className="card p-8 h-full cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      📄 Upload Resume
                    </h2>
                    <p className="text-gray-600">
                      Start by uploading your resume. We'll use it to generate personalized interview questions.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="primary" size="md" className="w-full">
                    Upload PDF
                  </Button>
                </div>
              </div>
            </Link>

            {/* Start Interview Card */}
            <Link href="/interview-setup">
              <div className="card p-8 h-full cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      🎯 Start Interview
                    </h2>
                    <p className="text-gray-600">
                      Begin a mock interview session. Choose from technical, HR, or aptitude interviews.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="secondary" size="md" className="w-full">
                    Start Now
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold gradient-text">0</div>
              <p className="text-gray-600 mt-2">Interviews Completed</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold gradient-text">0</div>
              <p className="text-gray-600 mt-2">Average Score</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold gradient-text">0</div>
              <p className="text-gray-600 mt-2">Resumes Uploaded</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
