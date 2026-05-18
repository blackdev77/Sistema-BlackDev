"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "@/components/ui/CommandPalette";

export function Shell({ children, session }: { children: React.ReactNode; session: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Drawer / Fixed sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-[260px] transform bg-sidebar border-r border-border transition-transform duration-300 ease-in-out
        md:translate-x-0 md:sticky md:top-0 md:h-screen md:shrink-0 md:flex
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar session={session} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
