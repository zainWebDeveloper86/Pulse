import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";

import { formatDateString } from "@/lib/utils/format";
import DeletePulse from "./DeletePulse";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  community: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  createdAt: Date;
  replies: {
    author: {
      image: string | null;
    };
  }[];
  repliesCount: number;
  isComment?: boolean;
}

export default function PulseCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  replies,
  repliesCount,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          {/* Avatar + Thread Line */}
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.id}`}
              className="relative h-11 w-11"
            >
              <Image
                src={author.image || "/assets/profile.svg"}
                alt={author.name}
                fill
                sizes="44px"
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>

            <div className="pulse-card_bar" />
          </div>

          {/* Content */}
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            {/* Action Icons */}
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Heart
                  size={22}
                  className="cursor-pointer text-gray-1 hover:text-primary-500 transition-colors"
                />
                <Link href={`/pulse/${id}`}>
                  <MessageCircle
                    size={22}
                    className="cursor-pointer text-gray-1 hover:text-primary-500 transition-colors"
                  />
                </Link>
                <Repeat2
                  size={22}
                  className="cursor-pointer text-gray-1 hover:text-primary-500 transition-colors"
                />
                <Send
                  size={22}
                  className="cursor-pointer text-gray-1 hover:text-primary-500 transition-colors"
                />
              </div>

              {isComment && repliesCount > 0 && (
                <Link href={`/pulse/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {repliesCount} repl{repliesCount > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <DeletePulse
          pulseId={id}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {/* Reply Avatars Preview */}
      {!isComment && replies.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {replies.map((reply, index) => (
            <Image
              key={index}
              src={reply.author.image || "/assets/profile.svg"}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/pulse/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {repliesCount} repl{repliesCount > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {/* Community + Date */}
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt.toISOString())}
            {community && ` - ${community.name} Community`}
          </p>

          {community.image && (
            <Image
              src={community.image}
              alt={community.name}
              width={14}
              height={14}
              className="ml-1 rounded-full object-cover"
            />
          )}
        </Link>
      )}
    </article>
  );
}