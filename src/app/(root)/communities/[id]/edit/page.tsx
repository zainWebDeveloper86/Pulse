import { redirect, notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import EditCommunityForm from "@/features/communities/components/EditCommunityForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Community | Pulse",
};

export default async function EditCommunityPage({ params }: Props) {
  const { id } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const community = await prisma.community.findUnique({
    where: { id },
  });

  if (!community) notFound();
  if (community.createdById !== clerkUser.id) redirect(`/communities/${id}`);

  return (
    <div>
      <h1 className="head-text">Edit Community</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Update your community information
      </p>

      <section className="mt-12">
        <EditCommunityForm
          community={{
            id: community.id,
            name: community.name,
            username: community.username,
            bio: community.bio || "",
            image: community.image || "",
          }}
        />
      </section>
    </div>
  );
}