"use client";

import { useState, ChangeEvent, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { userValidation, type UserFormData } from "@/lib/validations/user";
import { updateUser } from "@/features/users/actions";

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
  user: {
    id: string;
    name: string;
    username: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}


export default function OnboardingForm({ user, btnTitle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user.image);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  // 📸 Image select handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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


  // ☁️ Supabase Storage mein upload
  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!imageFile) return user.image; // if not new image, take old

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, imageFile, { upsert: true });

    if (error) {
      // console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }

    // Public URL lo
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  }, [imageFile, user.id, user.image,supabase])

  const onSubmit = async (values: UserFormData) => {
    setLoading(true);

    try {
      // 1. Image upload (agar naya hai)
      const imageUrl = await uploadImage();

      // 2. Prisma update
      await updateUser({
        userId: user.id,
        name: values.name,
        username: values.username,
        bio: values.bio || "",
        image: imageUrl || user.image,
        path: pathname,
      });

      toast.success(pathname === "/profile/edit" ? "Profile updated!" : "Profile completed!");

      // Dynamic routing 
      if (pathname === "/profile/edit") {
        router.back(); // move to previous page, where user click edit button
      } else {
        router.push("/"); // move to homepage(first page)
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
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
            {/* <label
              htmlFor="avatar-upload"
              className="cursor-pointer rounded-md bg-dark-3 px-4 py-2 text-sm font-medium text-light-1 transition-colors hover:bg-dark-4"
            >
              <Camera size={16} className="mr-2 inline" />
              Change Photo
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            /> */}
            <p className="text-xs text-light-4">JPG, PNG or GIF (max 5MB)</p>
          </div>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your full name"
                  className="bg-dark-3 border-dark-4 text-light-1 placeholder:text-light-4 focus-visible:ring-primary-500 h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
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
                  placeholder="your_username"
                  className="bg-dark-3 border-dark-4 text-light-1 placeholder:text-light-4 focus-visible:ring-primary-500 h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
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
                  placeholder="Tell us about yourself..."
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
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
}