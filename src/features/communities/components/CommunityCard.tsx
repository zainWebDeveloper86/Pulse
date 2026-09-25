"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string | null;
  bio: string | null;
  membersCount: number;
}

export default function CommunityCard({
  id,
  name,
  username,
  imgUrl,
  bio,
  membersCount,
}: Props) {
  const router = useRouter();

  return (
    <article className="community-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={imgUrl || "/assets/profile.svg"}
            alt={name}
            fill
            sizes="48px"
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <p className="mt-4 text-subtle-medium text-gray-1 line-clamp-2">
        {bio || "No description"}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-subtle-medium text-gray-1">
          <Users size={16} />
          <span>{membersCount} members</span>
        </div>

        <Button
          className="community-card_btn cursor-pointer"
          onClick={() => router.push(`/communities/${id}`)}
        >
          View
        </Button>
      </div>
    </article>
  );
}