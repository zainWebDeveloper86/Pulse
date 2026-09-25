import { redirect } from "next/navigation";
import { getClerkUser, getExistingUser } from "@/lib/auth";
import PulseForm from "@/features/pulses/components/PulseForm";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Create Pulse | Pulse",
};

export default async function CreatePulsePage() {
  const clerkUser = await getClerkUser();
  if (!clerkUser) return null;

  const userInfo = await getExistingUser();
  if (!userInfo?.onboarded) redirect("/onboarding");

  // ✅ SAARI communities dikhao (user member ho ya na ho)
  const communities = await prisma.community.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="head-text">Create Pulse</h1>

      <PulseForm userId={userInfo.id} communities={communities} />
    </div>
  );
}