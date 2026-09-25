import { fetchCommunityPulses } from "@/features/communities/queries";
import PulseCard from "@/features/pulses/components/PulseCard";
import { redirect } from "next/navigation";

interface Props {
  currentUserId: string;
  communityId: string;
}

export default async function CommunityPulsesTab({
  currentUserId,
  communityId,
}: Props) {
  const community = await fetchCommunityPulses(communityId);

  if (!community) redirect("/");

  if (community.pulses.length === 0) {
    return (
      <p className="no-result text-center py-8">No pulses yet</p>
    );
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {community.pulses.map((pulse) => (
        <PulseCard
          key={pulse.id}
          id={pulse.id}
          currentUserId={currentUserId}
          parentId={pulse.parentId}
          content={pulse.text}
          author={pulse.author}
          community={pulse.community}
          createdAt={pulse.createdAt}
          replies={pulse.replies.map((r) => ({ author: r.author }))}
          repliesCount={pulse._count.replies}
        />
      ))}
    </section>
  );
}