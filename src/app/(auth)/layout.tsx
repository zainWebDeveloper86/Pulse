import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth | Pulse",
  description: "Sign in to Pulse",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,                      
        variables: {
          colorPrimary: "#877eff",
          // colorBackground: "#121417",
          // colorInputBackground: "#101012",
          // colorInputText: "#ffffff",
        },
      }}
      afterSignOutUrl="/sign-in"
    >
      <html lang="en">
        <body
          className={`${inter.className} bg-dark-1`}
          suppressHydrationWarning
        >
          <div className="flex min-h-screen items-center justify-center px-4">
            {children}
          </div>
          <Toaster />  
        </body>
      </html>
    </ClerkProvider>
  );
}