"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { pulseValidation, type PulseFormData } from "@/lib/validations/pulse";
import { createPulse } from "@/features/pulses/actions";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  userId: string;
  communities: { id: string; name: string }[];
}

export default function PulseForm({ userId, communities }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [communityId, setCommunityId] = useState<string | null>(null);

  const form = useForm<PulseFormData>({
    resolver: zodResolver(pulseValidation),
    defaultValues: {
      pulse: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: PulseFormData) => {
    setLoading(true);

    try {
      await createPulse({
        text: values.pulse,
        communityId: communityId, // ← Dynamic
        path: pathname,
        authorId: userId,
      });

      toast.success("Pulse created!");
      form.reset();
      setCommunityId(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create pulse. Try again.");
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-8"
      >
        {/* Community Selector (agar user kisi community ka member hai) */}
        {communities?.length > 0 && (
          <div className="flex flex-col gap-3">
            <label className="text-base font-semibold text-light-2">
              Post to Community (optional)
            </label>
            <Select
              value={communityId || "personal"}
              onValueChange={(val) =>
                setCommunityId(val === "personal" ? null : val)
              }
            >
              <SelectTrigger className="bg-dark-3 border-dark-4 text-light-1 h-11">
                <SelectValue placeholder="Select community" />
              </SelectTrigger>
              <SelectContent className="bg-dark-3 text-light-1">
                <SelectItem value="personal">Personal (No community)</SelectItem>
                {communities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pulse Content */}
        <FormField
          control={form.control}
          name="pulse"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={12}
                  placeholder="What's on your mind?"
                  className="bg-dark-3 border-dark-4 text-light-1 placeholder:text-light-4 focus-visible:ring-primary-500 resize-none no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary-500 hover:bg-primary-500/90 text-light-1 font-semibold cursor-pointer"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Pulse
        </Button>
      </form>
    </Form>
  );
}