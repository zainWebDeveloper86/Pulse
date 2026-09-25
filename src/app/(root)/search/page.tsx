import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { getExistingUser } from "@/lib/auth";
import { fetchUsers } from "@/features/users/queries";
import UserCard from "@/features/users/components/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userInfo = await getExistingUser();
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: userInfo.id,
    searchString: q || "",
    pageNumber,
    perPagePulses: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path="/search"
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </section>
  );
}