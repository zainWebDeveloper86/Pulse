"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props {
  routeType: string;
}

export default function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Debounce: 300ms after user stops typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=${search}`);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType, router]);

  return (
    <div className="searchbar">
      <Search size={20} className="text-gray-1" />
      <Input
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={
          routeType === "communities"
            ? "Search communities"
            : "Search creators"
        }
        className="no-focus searchbar_input"
      />
    </div>
  );
}