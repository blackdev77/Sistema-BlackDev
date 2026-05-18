import { Search, Bell, Plus, Menu } from 'lucide-react';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-muted-foreground hover:text-white transition-colors md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        {/* Command Palette Trigger */}
        <button className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors bg-surface/50 border border-border rounded-sm px-3 py-1.5 text-sm w-full max-w-xs md:w-64">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search...</span>
          <span className="sm:hidden text-xs">Search...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="font-mono text-[10px] bg-background border border-border px-1.5 rounded-sm">⌘</kbd>
            <kbd className="font-mono text-[10px] bg-background border border-border px-1.5 rounded-sm">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-muted-foreground hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></span>
        </button>
        
        <div className="h-4 w-px bg-border"></div>

        <button className="bg-white text-black hover:bg-gray-200 transition-colors px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium rounded-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo</span>
        </button>
      </div>
    </header>
  );
}
