import { prisma } from "@/lib/prisma";

interface FetchUsersParama {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  perPagePulses?: number;
}

/**
 * Fetch user by ID
 */
export async function fetchUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          pulses: {
            where: { parentId: null }, // Sirf top-level pulses count
          },
        },
      },
    },
  });
}

/**
 * Fetch user with their pulses
 */
export async function fetchUserWithPulses(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      pulses: {
        where: { parentId: null }, // Only top-level pulses
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
          community: {
            select: { id: true, name: true, image: true },
          },
          replies: {
            take: 2,
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { image: true } },
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      },
    },
  });
}

/**
 * Search users with pagination
 */
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  perPagePulses = 20,
}: FetchUsersParama) {
  const skipAmount = (pageNumber - 1) * perPagePulses;

  // Build where clause
  const whereClause: any = {
    id: { not: userId }, // Exclude current user
  };

  // If search string is not empty, search name OR username
  if (searchString.trim() !== "") {
    whereClause.OR = [
      { username: { contains: searchString, mode: "insensitive" } },
      { name: { contains: searchString, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: skipAmount,
    take: perPagePulses,
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  });

  const totalUsers = await prisma.user.count({
    where: whereClause,
  });

  const isNext = totalUsers > skipAmount + users.length;

  return { users, isNext };
}

/**
 * Get activity: replies to user's pulses (excluding own replies)
 */
export async function getActivity(userId: string) {
  // Find all user's pulses (only top-level, not their own replies)
  const userPulses = await prisma.pulse.findMany({
    where: { authorId: userId },
    select: { id: true },
  });

  const pulseIds = userPulses.map((p) => p.id);

  // Find replies to those pulses, excluding the user's own replies
  const replies = await prisma.pulse.findMany({
    where: {
      parentId: { in: pulseIds },
      authorId: { not: userId },
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      parent: {
        select: { id: true },
      },
    },
  });

  return replies;
}
