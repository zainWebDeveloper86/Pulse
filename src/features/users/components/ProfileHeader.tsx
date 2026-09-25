import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string | null;
  bio: string | null;
  type?: "User" | "Community";
  editUrl?: string;  // ← Parent decide karega kaunsa URL hai
}

export default function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type = "User",
  editUrl,
}: Props) {
  // If editUrl explicitly provided → show button
  // Else → check user ownership
  const isOwner = type === "User" && accountId === authUserId;
  const canEdit = editUrl ? true : isOwner;

  const finalEditUrl = editUrl || "/profile/edit";

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={imgUrl || "/assets/profile.svg"}
              alt={name}
              fill
              sizes="80px"
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>

        {canEdit && (
          <Link href={finalEditUrl}>
            <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 transition-colors hover:bg-dark-4">
              <Pencil size={16} className="text-light-2" />
              <p className="text-light-2 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
      </div>

      {bio && (
        <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      )}

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}