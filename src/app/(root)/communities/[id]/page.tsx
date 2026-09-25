import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchCommunityDetails } from "@/features/communities/queries";
import CommunityPulsesTab from "@/features/communities/components/CommunityPulsesTab";
import ProfileHeader from "@/features/users/components/ProfileHeader";
import UserCard from "@/features/users/components/UserCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { communityTabs } from "@/config/nav";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailPage({ params }: Props) {
  const { id } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const community = await fetchCommunityDetails(id);

  if (!community) {
    return (
      <div className="text-center py-20">
        <p className="text-light-2 text-lg">Community not found</p>
      </div>
    );
  }

  return (
    <section>
      <ProfileHeader
        accountId={community.createdBy?.id || ""}
        authUserId={clerkUser.id}
        name={community.name}
        username={community.username}
        imgUrl={community.image}
        bio={community.bio}
        type="Community"
        editUrl={
          community.createdById === clerkUser.id
            ? `/communities/${community.id}/edit`
            : undefined
        }
      />

      <div className="mt-9">
        <Tabs defaultValue="pulses" className="w-full">
          <TabsList className="tab w-auto">
            {communityTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.label}
                  value={tab.value}
                  className="tab cursor-pointer"
                >
                  <Icon size={18} />
                  <p className="max-sm:hidden">{tab.label}</p>
                  <p className="sm:hidden">{tab.label.split(/\s+/)[0]}</p>

                  {tab.value === "pulses" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                      {community._count.pulses}
                    </p>
                  )}
                  {tab.value === "members" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                      {community._count.members}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="pulses" className="w-full text-light-1">
            <CommunityPulsesTab
              currentUserId={clerkUser.id}
              communityId={community.id}
            />
          </TabsContent>

          <TabsContent value="members" className="mt-9 w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {community.members.length === 0 ? (
                <p className="no-result text-center py-8">No members yet</p>
              ) : (
                community.members.map((member) => (
                  <UserCard
                    key={member.id}
                    id={member.id}
                    name={member.name}
                    username={member.username}
                    imgUrl={member.image}
                    personType="User"
                  />
                ))
              )}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <p className="no-result text-center py-8">Coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}