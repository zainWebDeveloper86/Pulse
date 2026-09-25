"use client";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";


import {
  communityValidation,
  type CommunityFormData,
} from "@/lib/validations/community";
import { createCommunity } from "@/features/communities/actions";

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
import { createClient } from "@/lib/supabase/client";

// interface Props {
//   user: {
//     id: string;
//     name: string;
//     username: string;
//     bio: string;
//     image: string;
//   };
//   btnTitle: string;
// }

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function CreateCommunityForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityValidation),
    defaultValues: { name: "", username: "", bio: "" },
  });


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileImg = e.target.files?.[0];
    if (!fileImg) return;

    if (!fileImg.type.includes("image")) {
      toast.error("Please select an image file!");
      return;
    }


    if (fileImg.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(fileImg);
    setImagePreview(URL.createObjectURL(fileImg));
  }

  // console.log("imageFile", imageFile);

  const uploadingImg = useCallback(async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars") // TODO: Rename bucket to "uploads"
      .upload(fileName, imageFile, { upsert: true });

    if (error) {
      // console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }

    // Public URL lo
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;

  }, [imageFile, supabase])


  const onSubmit = async (values: CommunityFormData) => {
    setLoading(true);

    try {

      const imgUrl = await uploadingImg()
      const community = await createCommunity({
        image: imgUrl ?? "",
        name: values.name,
        username: values.username,
        bio: values.bio,
      });

      toast.success("Community created!");
      router.push(`/communities/${community.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create community. Try again.");
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-8"
      >
        {/* 📸 Image Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-dark-4 bg-dark-3">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile"
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
              htmlFor="avatar-upload"
              className="cursor-pointer rounded-md bg-dark-3 px-4 py-2 text-sm font-medium text-light-1 transition-colors hover:bg-dark-4"
            >
              <Camera size={16} className="mr-2 inline" />
              Upload Photo
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-light-4">JPG, PNG or GIF (max 5MB)</p>
          </div>
        </div>

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
                  placeholder="e.g., Next.js Developers"
                  className="bg-dark-3 border-dark-4 text-light-1 placeholder:text-light-4 focus-visible:ring-primary-500 h-11"
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
                  placeholder="nextjs_devs"
                  className="bg-dark-3 border-dark-4 text-light-1 placeholder:text-light-4 focus-visible:ring-primary-500 h-11"
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
                  placeholder="What is this community about?"
                  className="bg-dark-3 border-dark-4 text-light-1 placeholder:text-light-4 focus-visible:ring-primary-500 resize-none"
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
          Create Community
        </Button>
      </form>
    </Form>
  );
}