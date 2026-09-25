import { prisma } from "@/lib/prisma";

/**
 * Fetch top-level pulses (no parent) with pagination
 */
export async function fetchPulses(
  pageNumber: number = 1,
  perPagePulses: number = 20,
) {
  const skipPulsesAmount = (pageNumber - 1) * perPagePulses;

  // Top-level pulses (parentId is null) with author + replies count
  const pulses = await prisma.pulse.findMany({
    where: {
      parentId: null, // Top-level only (not comments)
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: skipPulsesAmount,
    take: perPagePulses,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
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
        select: {
          replies: true,
        },
      },
    },
  });

  // Total count for pagination
  const totalPulses = await prisma.pulse.count({
    where: { parentId: null },
  });

  const isNext = totalPulses > skipPulsesAmount + pulses.length;

  return { pulses, isNext };
}

/**
 * Fetch a single pulse by ID with author + replies (nested)
 */
export async function fetchPulseById(pulseId: string) {
  return await prisma.pulse.findUnique({
    where: { id: pulseId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      community: {
        select: { id: true, name: true, image: true },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
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
            select: {
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

/**
 * Fetch all pulses created by a specific user
 */
export async function fetchUserPulses(userId: string) {
  return await prisma.pulse.findMany({
    where: {
      authorId: userId,
      parentId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });
}
