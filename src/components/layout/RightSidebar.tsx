import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function RightSidebar() {
  const { userId } = await auth();

  // Fetch suggested communities (latest 5)
  const communities = await prisma.community.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      _count: {
        select: { members: true },
      },
    },
  });

  // Fetch suggested users (latest 5, excluding current user)
  const users = await prisma.user.findMany({
    where: userId ? { id: { not: userId } } : {},
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  });

  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-1 flex-col justify-start gap-6">
        {/* Suggested Communities */}
        <div>
          <h3 className="text-heading4-medium text-light-1">
            Suggested Communities
          </h3>

          <div className="mt-7 flex w-70 flex-col gap-6">
            {communities.length === 0 ? (
              <p className="text-small-regular text-light-3">
                No communities yet
              </p>
            ) : (
              communities.map((community) => (
                <Link
                  key={community.id}
                  href={`/communities/${community.id}`}
                  className="flex cursor-pointer items-center justify-start gap-3 rounded-lg p-2 transition-colors hover:bg-dark-4"
                >
                  <div className="relative h-10 w-10 shrink-0">
                    <Image
                      src={community.image || "/assets/profile.svg"}
                      alt={community.name}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">
                      {community.name}
                    </h4>
                    <p className="text-small-medium text-gray-1">
                      @{community.username}
                    </p>
                  </div>

                  <p className="text-subtle-medium text-gray-1">
                    {community._count.members} {community._count.members === 1 ? "member" : "members"}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="mt-12">
          <h3 className="text-heading4-medium text-light-1">
            Suggested Users
          </h3>

          <div className="mt-7 flex w-70 flex-col gap-6">
            {users.length === 0 ? (
              <p className="text-small-regular text-light-3">
                No users yet
              </p>
            ) : (
              users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="flex cursor-pointer items-center justify-start gap-3 rounded-lg p-2 transition-colors hover:bg-dark-4"
                >
                  <div className="relative h-10 w-10 shrink-0">
                    <Image
                      src={user.image || "/assets/profile.svg"}
                      alt={user.name}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">
                      {user.name}
                    </h4>
                    <p className="text-small-medium text-gray-1">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}