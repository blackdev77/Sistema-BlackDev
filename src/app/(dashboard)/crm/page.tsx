import { Filter, Search } from "lucide-react"

import { prisma } from "@/lib/prisma";
import { LeadFormSlideOver } from "./LeadFormSlideOver";
import { KanbanBoard } from "./KanbanBoard";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";

export const dynamic = "force-dynamic";

export default async function CRMPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const take = 100; // Kanban boards usually load more items
  const skip = (page - 1) * take;

  const [allLeads, total] = await Promise.all([
    prisma.lead.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.lead.count()
  ]);

  const columns = [
    { id: "NOVO", title: "Novo", leads: allLeads.filter(l => l.status === "NOVO") },
    { id: "CONTACTADO", title: "Contactado", leads: allLeads.filter(l => l.status === "CONTACTADO") },
    { id: "REUNIAO", title: "Reunião", leads: allLeads.filter(l => l.status === "REUNIAO") },
    { id: "PROPOSTA", title: "Proposta", leads: allLeads.filter(l => l.status === "PROPOSTA") },
    { id: "NEGOCIACAO", title: "Negociação", leads: allLeads.filter(l => l.status === "NEGOCIACAO") },
    { id: "FECHADO", title: "Fechado", leads: allLeads.filter(l => l.status === "FECHADO") },
  ];
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Pipeline Comercial</h1>
          <p className="text-muted-foreground">Gestão de leads e oportunidades de negócio.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar lead..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <LeadFormSlideOver />
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-hidden flex flex-col gap-2">
        <div className="flex-1 overflow-hidden">
          <KanbanBoard initialColumns={columns} />
        </div>
        <div className="shrink-0 bg-surface/50 rounded p-1">
          <Pagination total={total} take={take} />
        </div>
      </div>
      
    </div>
  )
}
