import { redirect } from "next/navigation";
import { fetchUser } from "@/features/users/queries";
import OnboardingForm from "@/features/users/components/OnboardingForm";
import { getClerkUser } from "@/lib/auth";

export const metadata = {
  title: "Onboarding | Pulse",
};

export default async function OnboardingPage() {
  const user = await getClerkUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user.id,
    name: userInfo?.name || user.firstName || "",
    username: userInfo?.username || user.username || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl || "",
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col justify-start px-6 py-12 w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-light-1">Onboarding</h1>
        <p className="mt-2 text-light-3">
          Complete your profile to start using Pulse
        </p>
      </div>

      <section className="bg-dark-2 border border-dark-4 rounded-xl p-8">
        <OnboardingForm user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}