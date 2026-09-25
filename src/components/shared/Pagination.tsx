"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface Props {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

export default function Pagination({ pageNumber, isNext, path }: Props) {
  const router = useRouter();

  const handleNavigation = (type: "prev" | "next") => {
    let nextPageNumber = pageNumber;

    if (type === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
    } else {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 1) {
      router.push(`${path}?page=${nextPageNumber}`);
    } else {
      router.push(path);
    }
  };

  // Pehli page par ho aur next nahi hai → hide karo
  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="pagination">
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className="text-small-regular text-light-2 cursor-pointer"
      >
        Prev
      </Button>

      <p className="text-small-semibold text-light-1">{pageNumber}</p>

      <Button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className="text-small-regular text-light-2 cursor-pointer"
      >
        Next
      </Button>
    </div>
  );
}