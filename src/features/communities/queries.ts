import { prisma } from "@/lib/prisma";

/**
 * Fetch communities with search + pagination
 */
export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  const skipAmount = (pageNumber - 1) * pageSize;

  const whereClause: any = {};

  if (searchString.trim() !== "") {
    whereClause.OR = [
      { username: { contains: searchString, mode: "insensitive" } },
      { name: { contains: searchString, mode: "insensitive" } },
    ];
  }

  const communities = await prisma.community.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: skipAmount,
    take: pageSize,
    include: {
      members: {
        select: { id: true, name: true, username: true, image: true },
      },
      _count: {
        select: { members: true, pulses: true },
      },
    },
  });

  const totalCommunities = await prisma.community.count({
    where: whereClause,
  });

  const isNext = totalCommunities > skipAmount + communities.length;

  return { communities, isNext };
}

/**
 * Fetch community details (with creator + members)
 */
export async function fetchCommunityDetails(id: string) {
  return await prisma.community.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, username: true, image: true },
      },
      members: {
        select: { id: true, name: true, username: true, image: true },
      },
      _count: {
        select: { members: true, pulses: true },
      },
    },
  });
}

/**
 * Fetch community's pulses
 */
export async function fetchCommunityPulses(communityId: string) {
  return await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      pulses: {
        where: { parentId: null },
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
            include: { author: { select: { image: true } } },
          },
          _count: {
            select: { replies: true },
          },
        },
      },
    },
  });
}