"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

import { sidebarLinks } from "@/config/nav";
import { cn } from "@/lib/utils/cn";

export default function LeftSidebar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const { signOut } = useClerk();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const route =
            link.route === "/profile" && userId
              ? `/profile/${userId}`
              : link.route;

          const isActive =
            pathname === route ||
            (route !== "/" && pathname.startsWith(route));

          const Icon = link.icon;

          return (
            <Link
              href={route}
              key={link.label}
              className={cn(
                "leftsidebar_link transition-colors hover:bg-dark-4",
                isActive && "bg-primary-500 hover:bg-primary-500"
              )}
            >
              <Icon size={24} className="text-light-1 shrink-0" />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="flex w-full cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors hover:bg-dark-4"
        >
          <LogOut size={24} className="text-light-1 shrink-0" />
          <p className="text-light-2 max-lg:hidden">Logout</p>
        </button>
      </div>
    </section>
  );
}