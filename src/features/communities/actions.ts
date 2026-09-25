"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface CreateCommunityParams {
  image: string;
  name: string;
  username: string;
  bio?: string;
}

export async function createCommunity({
  name,
  username,
  bio,
  image,
}: CreateCommunityParams) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const community = await prisma.community.create({
      data: {
        name,
        username: username.toLowerCase(),
        bio: bio || null,
        image: image || null,
        createdById: userId,
        // Creator ko member banao
        members: {
          connect: { id: userId },
        },
      },
    });

    return community;
  } catch (error) {
    console.error("Error creating community:", error);
    throw new Error("Failed to create community");
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          connect: { id: memberId },
        },
      },
    });
  } catch (error) {
    console.error("Error adding member:", error);
    throw new Error("Failed to add member");
  }
}

export async function removeUserFromCommunity(
  communityId: string,
  userId: string
) {
  try {
    await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error("Error removing member:", error);
    throw new Error("Failed to remove member");
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { createdById: true },
    });

    if (!community) throw new Error("Community not found");
    if (community.createdById !== userId) throw new Error("Unauthorized");

    await prisma.community.update({
      where: { id: communityId },
      data: { name, username: username.toLowerCase(), image },
    });

    revalidatePath(`/communities/${communityId}`);
  } catch (error) {
    console.error("Error updating community:", error);
    throw new Error("Failed to update community");
  }
}

export async function deleteCommunity(communityId: string, path: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { createdById: true },
    });

    if (!community) throw new Error("Community not found");
    if (community.createdById !== userId) throw new Error("Unauthorized");

    await prisma.community.delete({
      where: { id: communityId },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting community:", error);
    throw new Error("Failed to delete community");
  }
}