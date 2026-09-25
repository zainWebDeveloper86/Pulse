import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public routes (without login accessible)
const publicRoutes = ["/sign-in", "/sign-up", "/onboarding", "/api/webhook"];

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Check route is public or not
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // if public route → move ahead
  if (isPublic) return NextResponse.next();

  // Wrap auth() in try/catch (stale session handling)
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (error) {
    console.error("Middleware auth error (stale session?):", error);
    // Stale session → sent to sign-in
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }
  // if user not logged in → move to sign-in page
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // if user is logged in but have onboarded -> false → move to onboarding page
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboarded: true },
    });

    // if user in not in database, (means webhook still not comes) → do wait
    if (!user) return NextResponse.next();

    // if user have onboarded -> false and user is not on onboarding page → move to onboarding page
    if (!user.onboarded && pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // if user have onboarded -> true and user is on onboarding page → move to home page
    if (user.onboarded && pathname === "/onboarding") {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
