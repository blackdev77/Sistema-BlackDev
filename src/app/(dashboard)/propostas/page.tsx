import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, MoreHorizontal, Search, Filter, Layers, DollarSign, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProposalFormSlideOver } from "./ProposalFormSlideOver";
import { AcceptProposalButton } from "./AcceptProposalButton";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function PropostasPage() {
  const [proposals, leads, clients] = await Promise.all([
    prisma.proposal.findMany({
      include: { lead: true, client: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.lead.findMany({
      where: { status: { not: "FECHADO" } },
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" }
    }),
    prisma.client.findMany({
      select: { id: true, tradeName: true },
      where: { status: "ACTIVE" },
      orderBy: { tradeName: "asc" }
    })
  ]);

  // Aggregate metrics
  const totalValue = proposals.reduce((acc, p) => acc + p.totalValue, 0);
  const acceptedValue = proposals
    .filter(p => p.status === "ACCEPTED")
    .reduce((acc, p) => acc + p.totalValue, 0);
  const pendingCount = proposals.filter(p => p.status === "DRAFT" || p.status === "SENT").length;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 custom-scrollbar">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Propostas Comerciais</h1>
          <p className="text-muted-foreground text-sm">Gere, envie e gerencie orçamentos e propostas comerciais integradas.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar proposta..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <ProposalFormSlideOver leads={leads} clients={clients} />
        </div>
      </div>

      {/* Quick Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        <Card className="bg-surface/40 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Total de Propostas</span>
              <span className="text-xl font-bold text-white">{proposals.length}</span>
            </div>
            <Layers className="w-5 h-5 text-emerald-400 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Volume Financeiro</span>
              <span className="text-xl font-bold text-white">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-400 opacity-80" />
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Valor Aprovado</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {acceptedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="flex-1 min-h-0">
        {proposals.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="Nenhuma proposta enviada"
            description="Comece gerando um orçamento a partir de um Lead existente ou Cliente cadastrado clicando em 'Nova Proposta' acima."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {proposals.map(prop => (
              <Card key={prop.id} className="group bg-surface border-border hover:border-white/20 transition-all flex flex-col justify-between h-[230px]">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`
                        font-mono text-[9px] uppercase tracking-wider px-2 py-0.5
                        ${prop.status === 'DRAFT' ? 'text-zinc-400 border-zinc-800 bg-zinc-950/20' : ''}
                        ${prop.status === 'ACCEPTED' ? 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20' : ''}
                        ${prop.status === 'SENT' ? 'text-blue-400 border-blue-900/40 bg-blue-950/20' : ''}
                        ${prop.status === 'VIEWED' ? 'text-amber-400 border-amber-900/40 bg-amber-950/20' : ''}
                        ${prop.status === 'REJECTED' ? 'text-rose-400 border-rose-900/40 bg-rose-950/20' : ''}
                      `}>
                        {prop.status === 'DRAFT' ? 'Rascunho' : 
                         prop.status === 'ACCEPTED' ? 'Aprovada' : 
                         prop.status === 'SENT' ? 'Enviada' : 
                         prop.status === 'VIEWED' ? 'Visualizada' : 
                         prop.status === 'REJECTED' ? 'Recusada' : prop.status}
                      </Badge>
                      
                      <button className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                        Para: <span className="text-white/80">{prop.client?.tradeName || prop.lead?.companyName || "Sem vínculo"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex justify-between items-center mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-muted uppercase tracking-wider">Valor do Orçamento</span>
                      <span className="text-sm font-mono font-bold text-white">
                        R$ {prop.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    {prop.status === "DRAFT" && (
                      <AcceptProposalButton proposalId={prop.id} />
                    )}

                    {prop.status === "ACCEPTED" && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Convertido
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}