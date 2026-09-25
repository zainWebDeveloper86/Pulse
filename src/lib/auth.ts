import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Get current user from Prisma (after webhook sync)
 */
export async function getExistingUser() {
  let userId: string | null = null;
  // wrap auth() in try/catch (stale session)
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (error) {
    console.error("auth() failed (stale session?):", error);
    return null;
  }

  if (!userId) return null;

  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user) return user;

  // Self-healing: if user not in DB, take it from clerk
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      clerkUser.username ||
      "Anonymous";

    // Auto-create user in DB
    user = await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        username: clerkUser.username || `user_${userId.slice(-8)}`,
        image: clerkUser.imageUrl || null,
        onboarded: false,
      },
    });

    return user;
  } catch (error) {
    // Stale session: user not found in Clerk → return null
    console.error("Clerk user fetch failed (stale session?):", error);
    return null;
  }
}

/**
 * Get Clerk user object directly
 */
export async function getClerkUser() {
  try {
    return await currentUser();
  } catch (error) {
    console.error("Clerk currentUser failed:", error);
    return null;
  }
}
