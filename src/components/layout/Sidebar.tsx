"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPaletteTrigger } from '@/components/ui/CommandPalette';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Kanban, 
  FileText, 
  FileSignature,
  Briefcase,
  CheckSquare,
  PieChart,
  Receipt,
  CreditCard,
  LifeBuoy,
  Users,
  LogOut,
  ShieldAlert,
  Globe,
  X
} from 'lucide-react';

export function Sidebar({ session, onClose }: { session: any; onClose?: () => void }) {
  const pathname = usePathname();
  
  // Resolve current user info or fallback to a professional placeholder
  const userName = session?.user?.name || "Gustavo";
  const userRole = session?.user?.role || "Administrador";
  
  // Generate initials dynamically
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "GU";

  return (
    <aside className="w-full h-full bg-sidebar flex flex-col">
      {/* Logo Container */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
        <Link href="/" onClick={onClose} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-serif font-bold text-xs">B</span>
          </div>
          <span className="font-bold text-white tracking-wide">BLACK<span className="font-serif italic font-normal">Dev</span></span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-white transition-colors md:hidden"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6">
        
        {/* Command Search */}
        <CommandPaletteTrigger />

        {/* GROWTH */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Growth</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/" icon={LayoutDashboard} label="Dashboard" active={pathname === "/"} onClick={onClose} />
            <NavItem href="/crm" icon={Kanban} label="Pipeline" active={pathname === "/crm" || pathname.startsWith("/crm/")} onClick={onClose} />
            <NavItem href="/clientes" icon={Users} label="Clientes" active={pathname === "/clientes" || pathname.startsWith("/clientes/")} onClick={onClose} />
            <NavItem href="/propostas" icon={FileText} label="Propostas" active={pathname === "/propostas" || pathname.startsWith("/propostas/")} onClick={onClose} />
            <NavItem href="/contratos" icon={FileSignature} label="Contratos" active={pathname === "/contratos" || pathname.startsWith("/contratos/")} onClick={onClose} />
          </nav>
        </div>

        {/* OPERAÇÃO */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Operação</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/projetos" icon={Briefcase} label="Projetos Ativos" active={pathname === "/projetos" || pathname.startsWith("/projetos/")} onClick={onClose} />
            <NavItem href="/tarefas" icon={CheckSquare} label="Tarefas Globais" active={pathname === "/tarefas" || pathname.startsWith("/tarefas/")} onClick={onClose} />
          </nav>
        </div>

        {/* CARTEIRA */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Carteira</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/contratos" icon={FileSignature} label="Contratos" active={pathname.startsWith("/contratos")} onClick={onClose} />
            <NavItem href="/suporte" icon={LifeBuoy} label="Suporte & Tickets" active={pathname.startsWith("/suporte")} onClick={onClose} />
          </nav>
        </div>

        {/* FINANCEIRO */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Financeiro</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/financeiro" icon={PieChart} label="Visão Geral" active={pathname === "/financeiro"} onClick={onClose} />
            <NavItem href="/faturas" icon={Receipt} label="Faturas" active={pathname === "/faturas" || pathname.startsWith("/faturas/")} onClick={onClose} />
            <NavItem href="/despesas" icon={CreditCard} label="Despesas" active={pathname === "/despesas" || pathname.startsWith("/despesas/")} onClick={onClose} />
          </nav>
        </div>

        {/* SISTEMA */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Sistema</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/admin/seguranca" icon={ShieldAlert} label="Segurança (Zero Trust)" active={pathname === "/admin/seguranca"} onClick={onClose} />
            <NavItem href="/admin/users" icon={Users} label="Gestão de Equipe" active={pathname === "/admin/users"} onClick={onClose} />
            <NavItem href="/admin/logs" icon={FileText} label="Auditoria (Logs)" active={pathname === "/admin/logs"} onClick={onClose} />
            <NavItem href="/portal" icon={Globe} label="Portal do Cliente" active={pathname === "/portal" || pathname.startsWith("/portal/")} onClick={onClose} />
          </nav>
        </div>

      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border/50 shrink-0">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center justify-between p-2 hover:bg-surface rounded transition-colors group text-left"
          title="Sair do sistema"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-surface-light border border-border flex items-center justify-center text-xs font-semibold uppercase text-white shrink-0">
              {initials}
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium text-white truncate w-full">{userName}</span>
              <span className="text-xs text-muted capitalize truncate w-full">{userRole.toLowerCase()}</span>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-muted group-hover:text-white transition-colors shrink-0" />
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label, active, onClick }: { href: string; icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors
        ${active 
          ? 'bg-surface text-white border-l-2 border-white' 
          : 'text-muted-foreground hover:text-white hover:bg-surface/50 border-l-2 border-transparent'
        }
      `}
    >
      <Icon className="w-[18px] h-[18px] stroke-[1.5]" />
      <span>{label}</span>
    </Link>
  );
}
