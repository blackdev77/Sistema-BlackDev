import { prisma } from "@/lib/prisma";
import { getPortalSession } from "@/app/actions/portal-auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, Receipt, FileSignature, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { ProposalActions } from "./ProposalActions";
import { ContractDownload } from "./ContractDownload";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const session = await getPortalSession();
  if (!session) redirect("/portal/login");

  const clientId = session.clientId;

  // Load all client data in parallel
  const [projects, invoices, contracts, proposals] = await Promise.all([
    prisma.project.findMany({
      where: { clientId },
      include: {
        tasks: true,
        milestones: { orderBy: { dueDate: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { clientId },
      orderBy: { dueDate: "asc" },
    }),
    prisma.contract.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.proposal.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Calculate summary stats
  const totalPending = invoices
    .filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.amount, 0);

  const activeProjects = projects.filter((p) => p.status !== "DELIVERED" && p.status !== "CANCELLED");

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
          Olá, {session.contactName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seus projetos, faturas e documentos com a BlackDev.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-950/50 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeProjects.length}</p>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Projetos Ativos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/50 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Em Aberto</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/50 flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{contracts.length}</p>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Contratos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices Banner */}
      {totalPending > 0 && (
        <Card className="border-amber-900/50 bg-amber-950/10">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  Você possui faturas em aberto totalizando{" "}
                  <span className="font-mono">R$ {totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Por favor, verifique a seção de Faturas abaixo para regularizar.
                </p>
              </div>
            </div>
            <a href="#faturas">
              <Badge variant="outline" className="text-amber-400 border-amber-900 bg-amber-950/20 hover:bg-amber-900/40 cursor-pointer transition-colors">
                Ver Faturas
              </Badge>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-white border-b border-border/50 pb-2">
          Seus Projetos
        </h2>

        {projects.length === 0 ? (
          <div className="bg-surface border border-border p-8 text-center">
            <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhum projeto em andamento no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const totalTasks = project.tasks.length;
              const doneTasks = project.tasks.filter((t) => t.status === "DONE").length;
              const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

              const statusMap: Record<string, { label: string; color: string }> = {
                PLANNING: { label: "Planejamento", color: "text-zinc-400 border-zinc-800" },
                EXECUTION: { label: "Em Execução", color: "text-blue-400 border-blue-900 bg-blue-950/20" },
                REVIEW: { label: "Revisão", color: "text-amber-400 border-amber-900 bg-amber-950/20" },
                DELIVERED: { label: "Entregue", color: "text-emerald-400 border-emerald-900 bg-emerald-950/20" },
                ON_HOLD: { label: "Pausado", color: "text-red-400 border-red-900 bg-red-950/20" },
              };

              const st = statusMap[project.status] || { label: project.status, color: "" };

              return (
                <Card key={project.id} className="hover:border-border-hover transition-all">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-lg font-bold text-white">{project.name}</h3>
                      <Badge variant="outline" className={st.color}>
                        {st.label}
                      </Badge>
                    </div>

                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    )}

                    {/* Progress */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex justify-between text-xs font-mono text-muted">
                        <span>Progresso</span>
                        <span className="text-white">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-border overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    {project.milestones.length > 0 && (
                      <div className="pt-3 border-t border-border/50 space-y-2">
                        <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Próximos Marcos</p>
                        {project.milestones.slice(0, 3).map((m) => (
                          <div key={m.id} className="flex items-center gap-2 text-sm">
                            {m.status === "COMPLETED" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className={m.status === "COMPLETED" ? "text-muted-foreground line-through" : "text-white"}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Proposals */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-white border-b border-border/50 pb-2">
          Propostas Comerciais
        </h2>

        {proposals.length === 0 ? (
          <div className="bg-surface border border-border p-8 text-center">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhuma proposta comercial recente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((p) => {
              const statusMap: Record<string, { label: string; color: string }> = {
                DRAFT: { label: "Rascunho", color: "text-zinc-400 border-zinc-800" },
                SENT: { label: "Enviada", color: "text-blue-400 border-blue-900 bg-blue-950/20" },
                VIEWED: { label: "Visualizada", color: "text-purple-400 border-purple-900 bg-purple-950/20" },
                ACCEPTED: { label: "Aceita", color: "text-emerald-400 border-emerald-900 bg-emerald-950/20" },
                REJECTED: { label: "Rejeitada", color: "text-red-400 border-red-900 bg-red-950/20" },
              };
              const st = statusMap[p.status] || { label: p.status, color: "" };

              return (
                <Card key={p.id}>
                  <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-bold text-white">{p.title}</h3>
                        <p className="text-xs font-mono text-muted-foreground">
                          Valor: R$ {p.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        {p.paymentTerms && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <span className="font-mono text-[10px] uppercase">Condições:</span> {p.paymentTerms}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className={st.color}>
                        {st.label}
                      </Badge>
                    </div>
                    <ProposalActions proposalId={p.id} status={p.status} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Invoices */}
      <section id="faturas" className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-white border-b border-border/50 pb-2">
          Faturas
        </h2>

        {invoices.length === 0 ? (
          <div className="bg-surface border border-border p-8 text-center">
            <Receipt className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhuma fatura registrada.</p>
          </div>
        ) : (
          <div className="bg-surface border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-[10px] font-mono text-muted uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-[10px] font-mono text-muted uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-[10px] font-mono text-muted uppercase tracking-wider">Vencimento</th>
                  <th className="px-6 py-3 text-[10px] font-mono text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4 text-white">{inv.description}</td>
                    <td className="px-6 py-4 font-mono text-white">
                      R$ {inv.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {inv.dueDate.toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={
                          inv.status === "PAID"
                            ? "text-emerald-400 border-emerald-900 bg-emerald-950/20"
                            : inv.status === "OVERDUE"
                              ? "text-red-400 border-red-900 bg-red-950/20"
                              : "text-amber-400 border-amber-900 bg-amber-950/20"
                        }
                      >
                        {inv.status === "PAID" ? "Paga" : inv.status === "OVERDUE" ? "Atrasada" : "Pendente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Contracts */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-white border-b border-border/50 pb-2">
          Contratos
        </h2>

        {contracts.length === 0 ? (
          <div className="bg-surface border border-border p-8 text-center">
            <FileSignature className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhum contrato registrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-white">{c.title}</h3>
                    <p className="text-xs font-mono text-muted-foreground">
                      R$ {c.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        c.status === "SIGNED"
                          ? "text-emerald-400 border-emerald-900"
                          : c.status === "DRAFT"
                            ? "text-zinc-400 border-zinc-800"
                            : "text-amber-400 border-amber-900"
                      }
                    >
                      {c.status === "SIGNED" ? "Assinado" : c.status === "DRAFT" ? "Rascunho" : "Pendente"}
                    </Badge>
                    {c.status === "SIGNED" && <ContractDownload contractTitle={c.title} />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-4 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} BlackDev — Portal do Cliente v1.0
        </p>
      </footer>
    </div>
  );
}
