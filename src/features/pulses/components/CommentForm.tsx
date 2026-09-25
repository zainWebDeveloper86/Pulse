"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { commentValidation, type CommentFormData } from "@/lib/validations/pulse";
import { addCommentToPulse } from "@/features/pulses/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface Props {
  pulseId: string;
  currentUserImg: string;
  currentUserId: string;
}

export default function CommentForm({
  pulseId,
  currentUserImg,
  currentUserId,
}: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentValidation),
    defaultValues: { pulse: "" },
  });

  const onSubmit = async (values: CommentFormData) => {
    setLoading(true);

    try {
      await addCommentToPulse(pulseId, values.pulse, pathname);
      form.reset();
      toast.success("Reply added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="pulse"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="cursor-pointer">
                <Image
                  src={currentUserImg || "/assets/profile.svg"}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  placeholder="Reply to this pulse..."
                  className="no-focus border-none bg-transparent text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="comment-form_btn cursor-pointer"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reply
        </Button>
      </form>
    </Form>
  );
}