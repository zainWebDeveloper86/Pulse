import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { getExistingUser } from "@/lib/auth";
import { fetchPulseById } from "@/features/pulses/queries";
import PulseCard from "@/features/pulses/components/PulseCard";
import CommentForm from "@/features/pulses/components/CommentForm";

export const revalidate = 0;

interface PulsePageProps {
  params: Promise<{ id: string }>;
}

export default async function PulseDetailPage({ params }: PulsePageProps) {
  const { id } = await params;

  if (!id) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userInfo = await getExistingUser();
  if (!userInfo?.onboarded) redirect("/onboarding");

  const pulse = await fetchPulseById(id);

  if (!pulse) {
    return (
      <div className="text-center py-20">
        <p className="text-light-2 text-lg">Pulse not found</p>
      </div>
    );
  }

  return (
    <section className="relative">
      {/* Parent Pulse */}
      <div>
        <PulseCard
          id={pulse.id}
          currentUserId={userInfo.id}
          parentId={pulse.parentId}
          content={pulse.text}
          author={pulse.author}
          community={pulse.community}
          createdAt={pulse.createdAt}
          replies={pulse.replies.map((r) => ({ author: r.author }))}
          repliesCount={pulse.replies.length}
        />
      </div>

      {/* Comment Form */}
      <div className="mt-7">
        <CommentForm
          pulseId={id}
          currentUserImg={userInfo.image || "/assets/profile.svg"}
          currentUserId={userInfo.id}
        />
      </div>

      {/* Replies List */}
      <div className="mt-10">
        {pulse.replies.length === 0 ? (
          <p className="text-center text-light-3 py-5">
            No replies yet. Be the first!
          </p>
        ) : (
          pulse.replies.map((reply) => (
            <PulseCard
              key={reply.id}
              id={reply.id}
              currentUserId={userInfo.id}
              parentId={reply.parentId}
              content={reply.text}
              author={reply.author}
              community={reply.community}
              createdAt={reply.createdAt}
              replies={reply.replies.map((r) => ({ author: r.author }))}
              repliesCount={reply._count.replies}
              isComment
            />
          ))
        )}
      </div>
    </section>
  );
}