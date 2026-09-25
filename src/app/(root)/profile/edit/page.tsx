import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/features/users/queries";
import EditProfileForm from "@/features/users/components/EditProfileForm";

export const metadata = {
  title: "Edit Profile | Pulse",
};

export default async function EditProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userInfo = await fetchUser(clerkUser.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: userInfo.id,
    name: userInfo.name || "",
    username: userInfo.username || "",
    bio: userInfo.bio || "",
    image: userInfo.image || "",
  };

  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Make any changes to your profile
      </p>

      <section className="mt-12">
        <EditProfileForm user={userData} btnTitle="Save Changes" />
      </section>
    </>
  );
}