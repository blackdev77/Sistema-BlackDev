import Link from 'next/link';
import { CommandPaletteTrigger } from '@/components/ui/CommandPalette';
import { 
  LayoutDashboard, 
  Kanban, 
  FileText, 
  FileSignature,
  Briefcase,
  CheckSquare,
  BookOpen,
  PieChart,
  Receipt,
  CreditCard,
  Repeat,
  LifeBuoy,
  Users,
  Settings,
  LogOut,
  ShieldAlert,
  Globe
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-[260px] h-screen bg-sidebar border-r border-border flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-serif font-bold text-xs">B</span>
          </div>
          <span className="font-bold text-white tracking-wide">BLACK<span className="font-serif italic font-normal">Dev</span></span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6">
        
        {/* Search */}
        <CommandPaletteTrigger />

        {/* GROWTH */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Growth</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/crm" icon={Kanban} label="Pipeline" active />
            <NavItem href="/clientes" icon={Users} label="Clientes" />
            <NavItem href="/propostas" icon={FileText} label="Propostas" />
            <NavItem href="/contratos" icon={FileSignature} label="Contratos" />
          </nav>
        </div>

        {/* OPERAÇÃO */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Operação</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/projetos" icon={Briefcase} label="Projetos Ativos" />
            <NavItem href="/tarefas" icon={CheckSquare} label="Tarefas Globais" />
          </nav>
        </div>

        {/* CARTEIRA */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Carteira</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/contratos" icon={FileSignature} label="Contratos" />
            <NavItem href="/suporte" icon={LifeBuoy} label="Suporte & Tickets" />
          </nav>
        </div>

        {/* FINANCEIRO */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Financeiro</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/financeiro" icon={PieChart} label="Visão Geral" />
            <NavItem href="/faturas" icon={Receipt} label="Faturas" />
            <NavItem href="/despesas" icon={CreditCard} label="Despesas" />
          </nav>
        </div>

        {/* SISTEMA */}
        <div>
          <h3 className="px-3 text-[10px] font-mono tracking-widest text-muted uppercase mb-2">Sistema</h3>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/admin/seguranca" icon={ShieldAlert} label="Segurança (Zero Trust)" />
            <NavItem href="/admin/users" icon={Users} label="Gestão de Equipe" />
            <NavItem href="/admin/logs" icon={FileText} label="Auditoria (Logs)" />
            <NavItem href="/portal" icon={Globe} label="Portal do Cliente" />
          </nav>
        </div>

      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border/50">
        <button className="w-full flex items-center justify-between p-2 hover:bg-surface rounded transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-medium">
              GU
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white">Gustavo</span>
              <span className="text-xs text-muted">Admin</span>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
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
