"use client";

import Link from "next/link";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 px-6 py-6 flex justify-between items-center z-10">
        <div className="text-3xl font-bold gradient-text">InterviewAI</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" size="md">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="md">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "2s"}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Master Your <span className="gradient-text">Interviews</span> with AI
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Get real-time feedback from advanced AI. Practice with unlimited mock interviews tailored to your skills and experience.
          </p>

          {/* Feature bullets */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl">🎯</div>
              <p className="text-gray-400">Personalized Questions</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl">💡</div>
              <p className="text-gray-400">Real-time Feedback</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl">📊</div>
              <p className="text-gray-400">Detailed Analytics</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-gray-400 mt-8">No credit card required • 5 free practice interviews</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-400">
        <p>&copy; 2026 InterviewAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
