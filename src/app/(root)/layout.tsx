import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { Topbar, RightSidebar, Bottombar, LeftSidebar } from "@/components/layout";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse",
  description: "A modern social platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: { colorPrimary: "#877eff" },
      }}
      afterSignOutUrl="/sign-in"
    >
      <html lang="en">
        <body
          className={`${inter.className} bg-dark-1`}
          suppressHydrationWarning
        >
          <Topbar />

          <main className='flex flex-row'>
            <LeftSidebar />
            <section className='main-container'>
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            <RightSidebar />
          </main>

          <Bottombar />
          <Toaster />  
        </body>
      </html>
    </ClerkProvider>
  );
}