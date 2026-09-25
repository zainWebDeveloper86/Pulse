import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/features/users/queries";
import ProfileHeader from "@/features/users/components/ProfileHeader";
import UserPulsesTab from "@/features/users/components/UserPulsesTab";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { profileTabs } from "@/config/nav";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const userInfo = await fetchUser(id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={clerkUser.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
                type="User"
            />

            <div className="mt-9">
                <Tabs defaultValue="pulses" className="w-full">
                    <TabsList className="tab w-auto">
                        {profileTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <TabsTrigger
                                    key={tab.label}
                                    value={tab.value}
                                    className="tab cursor-pointer"
                                >
                                    <Icon size={18} />
                                    <p className="max-sm:hidden">{tab.label}</p>
                                    {tab.label === "Pulses" && (
                                        <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium! text-light-2'>
                                            {userInfo._count.pulses}
                                        </p>
                                    )}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {profileTabs.map((tab) => (
                        <TabsContent
                            key={`content-${tab.label}`}
                            value={tab.value}
                            className="w-full text-light-1"
                        >
                            {tab.value === "pulses" && (
                                <UserPulsesTab
                                    currentUserId={clerkUser.id}
                                    accountId={userInfo.id}
                                />
                            )}
                            {tab.value !== "pulses" && (
                                <p className="no-result text-center py-8">
                                    Coming soon...
                                </p>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}