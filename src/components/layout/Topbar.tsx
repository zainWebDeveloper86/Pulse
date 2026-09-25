import Link from "next/link";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center">
        <p className="text-heading3-bold text-light-1">
          Pulse<span className="text-primary-500">.</span>
        </p>
      </Link>

      <div className="flex items-center gap-3">
        {/* Mobile logout button (small screens only) */}
        <div className="block md:hidden">
          <SignOutButton redirectUrl="/sign-in">
            <button
              className="flex cursor-pointer items-center justify-center p-2 rounded-md hover:bg-dark-4 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} className="text-light-1" />
            </button>
          </SignOutButton>
        </div>

        {/* Clerk User Button (avatar with dropdown) */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </div>
    </nav>
  );
}