"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/config/nav";
import { cn } from "@/lib/utils/cn";

export default function Bottombar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
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
                "bottombar_link transition-colors",
                isActive && "bg-primary-500"
              )}
            >
              <Icon size={18} className="text-light-1" />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}