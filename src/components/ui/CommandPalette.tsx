"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Users,
  FileText,
  Briefcase,
  Receipt,
  CreditCard,
  ShieldAlert,
  PieChart,
  FileSignature,
  Globe,
  LifeBuoy,
  Search,
  Command,
} from "lucide-react";

const ROUTES = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, keywords: "home início visão geral" },
  { name: "Pipeline (CRM)", href: "/crm", icon: Kanban, keywords: "leads vendas comercial pipeline kanban" },
  { name: "Clientes", href: "/clientes", icon: Users, keywords: "empresas contas carteira" },
  { name: "Propostas", href: "/propostas", icon: FileText, keywords: "orçamento proposta comercial" },
  { name: "Contratos", href: "/contratos", icon: FileSignature, keywords: "documentos legais assinatura" },
  { name: "Projetos", href: "/projetos", icon: Briefcase, keywords: "operação entregas desenvolvimento" },
  { name: "Faturas", href: "/faturas", icon: Receipt, keywords: "cobrança pagamento receber" },
  { name: "Despesas", href: "/despesas", icon: CreditCard, keywords: "custos gastos pagar" },
  { name: "Financeiro", href: "/financeiro", icon: PieChart, keywords: "receita despesa resultado" },
  { name: "Segurança (Zero Trust)", href: "/admin/seguranca", icon: ShieldAlert, keywords: "dispositivos aprovação segurança" },
  { name: "Equipe", href: "/admin/users", icon: Users, keywords: "time usuários colaboradores" },
  { name: "Suporte", href: "/suporte", icon: LifeBuoy, keywords: "tickets chamados atendimento" },
  { name: "Portal do Cliente", href: "/portal", icon: Globe, keywords: "portal externo cliente" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = ROUTES.filter((r) => {
    const q = query.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.keywords.toLowerCase().includes(q)
    );
  });

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].href);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className="relative max-w-lg mx-auto mt-[15vh] animate-in slide-in-from-top-4 fade-in duration-200">
        <div className="bg-sidebar border border-border shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar módulo, ação ou página..."
              className="w-full bg-transparent border-none py-4 text-sm text-white focus:outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden md:inline-flex h-5 px-1.5 items-center text-[10px] font-mono text-muted-foreground bg-background border border-border rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[320px] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                Nenhum resultado para "<span className="text-white">{query}</span>"
              </div>
            ) : (
              filtered.map((route, index) => (
                <button
                  key={route.href}
                  onClick={() => handleSelect(route.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors text-left ${
                    index === selectedIndex
                      ? "bg-surface text-white"
                      : "text-muted-foreground hover:bg-surface/50"
                  }`}
                >
                  <route.icon className="w-4 h-4 shrink-0" />
                  <span>{route.name}</span>
                  <span className="ml-auto text-[10px] font-mono text-muted opacity-50">{route.href}</span>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 border-t border-border flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-background border border-border rounded text-[9px]">↑↓</kbd> Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-background border border-border rounded text-[9px]">↵</kbd> Abrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-background border border-border rounded text-[9px]">Esc</kbd> Fechar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trigger button for the sidebar
export function CommandPaletteTrigger() {
  const [, setOpen] = useState(false);

  const handleClick = () => {
    // Dispatch the keyboard shortcut programmatically
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-surface/50 transition-colors rounded-sm border border-border/50 border-dashed"
    >
      <Search className="w-[18px] h-[18px] stroke-[1.5]" />
      <span className="flex-1 text-left">Buscar...</span>
      <kbd className="hidden md:inline-flex text-[10px] font-mono text-muted bg-background border border-border px-1.5 py-0.5 rounded">
        Ctrl+K
      </kbd>
    </button>
  );
}
