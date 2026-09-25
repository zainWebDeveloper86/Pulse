"use client";

import { usePathname, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deletePulse } from "@/features/pulses/actions";

interface Props {
  pulseId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

export default function DeletePulse({
  pulseId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // Sirf author delete kar sakta hai
  if (currentUserId !== authorId) return null;

  const handleDelete = async () => {
    try {
      await deletePulse(pulseId, pathname);

      // Agar comment tha, toh page refresh (comment list update)
      // Warna home par redirect
      if (!parentId || !isComment) {
        router.push("/");
      } else {
        router.refresh();
      }

      toast.success("Pulse deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete pulse");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="cursor-pointer transition-colors hover:text-red-500"
      aria-label="Delete pulse"
    >
      <Trash2 size={18} className="text-gray-1 hover:text-primary-500 transition-colors" />
    </button>
  );
}