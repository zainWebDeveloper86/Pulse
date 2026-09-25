import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getExistingUser } from "@/lib/auth";
import { getActivity } from "@/features/users/queries";

export const metadata = {
  title: "Activity | Pulse",
};

export default async function ActivityPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userInfo = await getExistingUser();
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo.id);

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((item) => (
              <Link key={item.id} href={`/pulse/${item.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={item.author.image || "/assets/profile.svg"}
                    alt={item.author.name}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {item.author.name}
                    </span>{" "}
                    replied to your pulse
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-base-regular text-light-3">
            No activity yet
          </p>
        )}
      </section>
    </>
  );
}