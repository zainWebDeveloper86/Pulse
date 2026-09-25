import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { getExistingUser } from "@/lib/auth";
import CreateCommunityForm from "@/features/communities/components/CreateCommunityForm";

export const metadata = {
  title: "Create Community | Pulse",
};

export default async function CreateCommunityPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userInfo = await getExistingUser();
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="head-text">Create Community</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Bring people together around shared interests
      </p>

      <section className="mt-12">
        <CreateCommunityForm />
      </section>
    </div>
  );
}