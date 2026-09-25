import { fetchUserWithPulses } from "@/features/users/queries";
import PulseCard from "@/features/pulses/components/PulseCard";
import { redirect } from "next/navigation";

interface Props {
  currentUserId: string;
  accountId: string;
}

export default async function UserPulsesTab({
  currentUserId,
  accountId,
}: Props) {
  const user = await fetchUserWithPulses(accountId);

  if (!user) {
    redirect("/");
  }

  if (user.pulses.length === 0) {
    return (
      <p className="no-result text-center py-8">
        No pulses yet
      </p>
    );
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {user.pulses.map((pulse) => (
        <PulseCard
          key={pulse.id}
          id={pulse.id}
          currentUserId={currentUserId}
          parentId={pulse.parentId}
          content={pulse.text}
          author={{
            id: user.id,
            name: user.name,
            image: user.image,
          }}
          community={pulse.community}
          createdAt={pulse.createdAt}
          replies={pulse.replies.map((r) => ({ author: r.author }))}
          repliesCount={pulse._count.replies}
        />
      ))}
    </section>
  );
}