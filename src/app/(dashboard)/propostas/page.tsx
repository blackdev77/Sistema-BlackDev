import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProposalFormSlideOver } from "./ProposalFormSlideOver";
import { AcceptProposalButton } from "./AcceptProposalButton";

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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="h-20 border-b border-border/50 flex items-center justify-between px-8 shrink-0 bg-background/50 backdrop-blur-xl">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight">Propostas Comerciais</h1>
          <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-widest">Orçamentos e Negociações</p>
        </div>
        <ProposalFormSlideOver leads={leads} clients={clients} />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {proposals.length === 0 ? (
            <EmptyState 
              icon={FileText}
              title="Nenhuma proposta enviada"
              description="Comece gerando um orçamento a partir de um Lead existente."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposals.map(prop => (
                <Card key={prop.id} className="group hover:border-border-hover transition-all">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`
                        ${prop.status === 'DRAFT' ? 'text-zinc-400 border-zinc-800' : ''}
                        ${prop.status === 'ACCEPTED' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/20' : ''}
                      `}>
                        {prop.status === 'DRAFT' ? 'Rascunho' : prop.status === 'ACCEPTED' ? 'Aprovada' : prop.status}
                      </Badge>
                      <button className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-white leading-tight">{prop.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Para: {prop.client?.legalName || prop.lead?.companyName || "Sem vínculo"}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-between items-center mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-muted uppercase">Valor Total</span>
                        <span className="text-sm font-mono text-white">
                          R$ {prop.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {prop.status === "DRAFT" && (
                        <AcceptProposalButton proposalId={prop.id} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}