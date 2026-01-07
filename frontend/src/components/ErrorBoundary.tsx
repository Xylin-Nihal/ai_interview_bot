"use client";

import { useEffect } from "react";
import { Button } from "./Button";

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-6">
      <div className="card p-8 text-center max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">❌ Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <Button onClick={reset} variant="primary" size="lg" className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
