"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-1 px-6 text-center">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
        <AlertTriangle size={40} className="text-red-500" />
      </div>

      {/* Heading */}
      <h1 className="mt-8 text-heading2-bold text-light-1">
        Something went wrong
      </h1>

      {/* Message */}
      <p className="mt-3 max-w-md text-base-regular text-light-3">
        An unexpected error occurred. Please try again or contact support if
        the problem persists.
      </p>

      {/* Error digest (dev only) */}
      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mt-4 max-w-2xl overflow-auto rounded-lg border border-dark-4 bg-dark-2 p-4 text-left font-mono text-xs text-red-400">
          {error.message}
        </pre>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={reset}
          className="h-11 bg-primary-500 hover:bg-primary-500/90 text-light-1 font-semibold cursor-pointer"
        >
          <RotateCcw size={18} className="mr-2" />
          Try Again
        </Button>

        <Link href="/">
          <Button
            variant="outline"
            className="h-11 border-dark-4 text-dark-1 hover:border-primary-500 hover:text-primary-500 cursor-pointer"
          >
            <Home size={18} className="mr-2" />
            Go Home
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-12 text-small-regular text-light-4">
        Error ID: {error.digest || "unknown"}
      </p>
    </div>
  );
}