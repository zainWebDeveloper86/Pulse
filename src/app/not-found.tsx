import Link from "next/link";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 | Pulse",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-1 px-6 text-center">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/10 border border-primary-500/20">
        <Ghost size={40} className="text-primary-500" />
      </div>

      {/* 404 Number */}
      <h1 className="mt-8 font-mono text-7xl font-bold text-light-1">
        4
        <span className="text-primary-500">0</span>
        4
      </h1>

      {/* Heading */}
      <h2 className="mt-4 text-heading3-bold text-light-1">
        Page not found
      </h2>

      {/* Message */}
      <p className="mt-3 max-w-md text-base-regular text-light-3">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get
        you back on track.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/">
          <Button className="h-11 bg-primary-500 hover:bg-primary-500/90 text-light-1 font-semibold cursor-pointer">
            <Home size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>

        <Link href="/communities">
          <Button
            variant="outline"
            className="h-11 border-dark-4 text-light-1 hover:border-primary-500 hover:text-primary-500 cursor-pointer"
          >
            <ArrowLeft size={18} className="mr-2" />
            Explore Communities
          </Button>
        </Link>
      </div>

      {/* Decorative dots */}
      <div className="mt-16 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-dark-4" />
        <span className="h-1 w-1 rounded-full bg-dark-4" />
        <span className="h-1 w-1 rounded-full bg-primary-500" />
        <span className="h-1 w-1 rounded-full bg-dark-4" />
        <span className="h-1 w-1 rounded-full bg-dark-4" />
      </div>
    </div>
  );
}