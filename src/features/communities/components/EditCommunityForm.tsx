// src/features/communities/components/EditCommunityForm.tsx
"use client";

import { useState, ChangeEvent, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  communityValidation,
  type CommunityFormData,
} from "@/lib/validations/community";
import { updateCommunityInfo } from "@/features/communities/actions";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  community: {
    id: string;
    name: string;
    username: string;
    bio: string;
    image: string;
  };
}

export default function EditCommunityForm({ community }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(community.image);

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityValidation),
    defaultValues: {
      name: community.name,
      username: community.username,
      bio: community.bio,
    },
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!imageFile) return community.image || null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, imageFile, { upsert: true });

    if (error) throw new Error("Failed to upload image");

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  }, [imageFile, community.image, supabase]);

  const onSubmit = async (values: CommunityFormData) => {
    setLoading(true);

    try {
      const imgUrl = await uploadImage();

      await updateCommunityInfo(
        community.id,
        values.name,
        values.username,
        imgUrl || ""
      );

      toast.success("Community updated!");
      router.push(`/communities/${community.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update community");
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-8"
      >
        {/* Image Section - same as CreateCommunityForm */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-dark-4 bg-dark-3">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Community"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={32} className="text-light-4" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="community-image-upload"
              className="cursor-pointer rounded-md bg-dark-3 px-4 py-2 text-sm font-medium text-light-1 transition-colors hover:bg-dark-4"
            >
              <Camera size={16} className="mr-2 inline" />
              Change Photo
            </label>
            <input
              id="community-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-light-4">JPG, PNG or GIF (max 5MB)</p>
          </div>
        </div>

        {/* Same fields as Create form */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold text-light-2">
                Community Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="bg-dark-3 border-dark-4 text-light-1 h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="bg-dark-3 border-dark-4 text-light-1 h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className="bg-dark-3 border-dark-4 text-light-1 resize-none"
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
          Save Changes
        </Button>
      </form>
    </Form>
  );
}