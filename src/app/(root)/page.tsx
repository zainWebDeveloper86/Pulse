import { redirect } from "next/navigation";

import { getClerkUser, getExistingUser } from "@/lib/auth";
import { fetchPulses } from "@/features/pulses/queries";
import PulseCard from "@/features/pulses/components/PulseCard";
import Pagination from "@/components/shared/Pagination";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const clerkUser = await getClerkUser();

  // Agar Clerk user nahi → sign-in par redirect
  if (!clerkUser) redirect("/sign-in");


  const userInfo = await getExistingUser();

  // Agar DB user nahi → sign-in par redirect
  if (!userInfo) redirect("/sign-in");

  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPulses(pageNumber, 20);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.pulses.length === 0 ? (
          <p className="no-result">No pulses found</p>
        ) : (
          <>
            {result.pulses.map((pulse) => (
              <PulseCard
                key={pulse.id}
                id={pulse.id}
                currentUserId={userInfo.id}
                parentId={pulse.parentId}
                content={pulse.text}
                author={pulse.author}
                community={pulse.community}
                createdAt={pulse.createdAt}
                replies={pulse.replies}
                repliesCount={pulse._count.replies}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </>
  );
}