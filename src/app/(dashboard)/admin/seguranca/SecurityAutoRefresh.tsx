"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SecurityAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Automatically poll and refresh the Server Component data in the background every 5 seconds
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
