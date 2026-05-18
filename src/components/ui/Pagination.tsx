"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({ total, take }: { total: number, take: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(total / take) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-xs text-muted-foreground font-mono">
        Página {currentPage} de {totalPages} ({total} registros)
      </div>
      <div className="flex items-center gap-2">
        <Link 
          href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
          className={`p-2 border border-border bg-surface text-muted-foreground rounded transition-colors ${currentPage <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-border hover:text-white"}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <Link 
          href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
          className={`p-2 border border-border bg-surface text-muted-foreground rounded transition-colors ${currentPage >= totalPages ? "opacity-50 pointer-events-none" : "hover:bg-border hover:text-white"}`}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
