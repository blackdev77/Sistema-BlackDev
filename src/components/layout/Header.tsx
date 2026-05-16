import { Search, Bell, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {/* Command Palette Trigger */}
        <button className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors bg-surface/50 border border-border rounded-sm px-3 py-1.5 text-sm w-64">
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="font-mono text-[10px] bg-background border border-border px-1.5 rounded-sm">⌘</kbd>
            <kbd className="font-mono text-[10px] bg-background border border-border px-1.5 rounded-sm">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></span>
        </button>
        
        <div className="h-4 w-px bg-border"></div>

        <button className="bg-white text-black hover:bg-gray-200 transition-colors px-4 py-1.5 text-sm font-medium rounded-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo
        </button>
      </div>
    </header>
  );
}
