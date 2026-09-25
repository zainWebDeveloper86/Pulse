"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface CreatePulseParams {
  text: string;
  authorId: string;
  communityId?: string | null;
  path: string;
}

// =============================================
//  Create a new pulse
// =============================================

export async function createPulse({
  text,
  authorId,
  communityId,
  path,
}: CreatePulseParams) {
  // const { userId } = await auth();

  if (!authorId) throw new Error("Unauthorized");

  try {
    const pulse = await prisma.pulse.create({
      data: {
        text,
        authorId,
        communityId: communityId || null,
      },
    });

    revalidatePath(path);

    return pulse;  // for taking another actions on this pulse
  } catch (error) {
    console.error("Error creating pulse:", error);
    throw new Error("Failed to create pulse");
  }
}

// =============================================
//  Delete a pulse and all its replies (cascade handled by Prisma onDelete)
// =============================================

export async function deletePulse(pulseId: string, path: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  try {
    // Verify ownership
    const pulse = await prisma.pulse.findUnique({
      where: { id: pulseId },
      select: { authorId: true },
    });

    if (!pulse) throw new Error("Pulse not found");
    if (pulse.authorId !== userId) throw new Error("Unauthorized");

    // Prisma cascade deletes replies (onDelete: Cascade in schema)
    await prisma.pulse.delete({
      where: { id: pulseId },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting pulse:", error);
    throw new Error("Failed to delete pulse");
  }
}

// =============================================
//  Add a comment (reply) to an existing pulse
// =============================================

export async function addCommentToPulse(
  pulseId: string,
  commentText: string,
  path: string
) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  try {
    // Verify parent pulse exists
    const parentPulse = await prisma.pulse.findUnique({
      where: { id: pulseId },
    });

    if (!parentPulse) throw new Error("Pulse not found");

    // Create reply
    const comment = await prisma.pulse.create({
      data: {
        text: commentText,
        authorId: userId,
        parentId: pulseId,
      },
    });

    revalidatePath(path);

    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}