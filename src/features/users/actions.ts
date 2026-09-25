"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getClerkUser } from "@/lib/auth";

interface UpdateUserParams {
  userId: string;
  name: string;
  username: string;
  bio: string;
  image?: string;
  path: string;
}

export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  path,
}: UpdateUserParams) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Clerk se email lo (kyunki Prisma mein required hai)
    const clerkUser = await getClerkUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name,
        username: username.toLowerCase(),
        bio: bio || null,
        image: image || null,
        onboarded: true,
      },
      create: {
        id: userId,
        email,
        name,
        username: username.toLowerCase(),
        bio: bio || null,
        image: image || null,
        onboarded: true,
      },
    });

    // revalidate all relevant paths
    revalidatePath("/", "layout"); // ← Root layout + sab pages
    revalidatePath("/onboarding"); // ← Onboarding page
    revalidatePath("/profile"); // ← Profile pages
    if (path) revalidatePath(path); // ← Called path
    
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}
