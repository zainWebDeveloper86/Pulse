import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getExistingUser } from "@/lib/auth";
import { fetchCommunities } from "@/features/communities/queries";
import CommunityCard from "@/features/communities/components/CommunityCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function CommunitiesPage({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userInfo = await getExistingUser();
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: q || "",
    pageNumber,
    pageSize: 25,
  });

  return (
    <>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="head-text">Communities</h1>

        <Link
          href="/communities/create"
          className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-small-medium text-light-1 transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          <span className="max-sm:hidden">Create</span>
        </Link>
      </div>

      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.communities.length === 0 ? (
          <div className="w-full text-center py-10">
            <p className="no-result">No communities found</p>
            <Link
              href="/communities/create"
              className="mt-4 inline-block text-primary-500 hover:underline"
            >
              Create the first one →
            </Link>
          </div>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                membersCount={community._count.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/communities"
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </>
  );
}