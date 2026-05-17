import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Users,
  Receipt,
  TrendingUp,
  Kanban,
  MoreHorizontal,
  Clock,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Parallel data fetching for maximum performance
  const [
    invoicesPaid,
    invoicesPending,
    expensesTotal,
    activeProjects,
    totalClients,
    totalLeads,
    recentProjects,
    overdueInvoices,
    recentActivity,
  ] = await Promise.all([
    // Revenue: sum of PAID invoices this month
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    // Pending invoices
    prisma.invoice.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { status: { in: ["PENDING", "OVERDUE"] } },
    }),
    // Expenses this month
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    // Active projects count
    prisma.project.count({
      where: { status: { in: ["PLANNING", "EXECUTION", "REVIEW"] } },
    }),
    // Total clients
    prisma.client.count({ where: { status: "ACTIVE" } }),
    // Leads this month
    prisma.lead.count({
      where: {
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    // Recent projects with client
    prisma.project.findMany({
      take: 5,
      include: { client: { select: { tradeName: true } }, tasks: true },
      orderBy: { updatedAt: "desc" },
    }),
    // Overdue invoices
    prisma.invoice.findMany({
      where: { status: "OVERDUE" },
      include: { client: { select: { tradeName: true } } },
      take: 5,
      orderBy: { dueDate: "asc" },
    }),
    // Recent audit activity
    prisma.activityLog.findMany({
      take: 8,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const revenue = invoicesPaid._sum.amount || 0;
  const expenses = expensesTotal._sum.amount || 0;
  const pending = invoicesPending._sum.amount || 0;
  const profit = revenue - expenses;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão executiva — {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/crm">
            <Button variant="outline" className="gap-2">
              <Kanban className="w-4 h-4" />
              Pipeline
            </Button>
          </Link>
          <Link href="/propostas">
            <Button variant="primary">Nova Proposta</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          label="Receita (Mês)"
          value={`R$ ${revenue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`}
          icon={TrendingUp}
          trend={revenue > 0 ? "up" : undefined}
          trendValue={revenue > 0 ? "Este mês" : undefined}
          accent="emerald"
        />
        <KPICard
          label="Despesas (Mês)"
          value={`R$ ${expenses.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`}
          icon={Receipt}
          trend={expenses > 0 ? "down" : undefined}
          accent="red"
        />
        <KPICard
          label="Projetos Ativos"
          value={String(activeProjects)}
          icon={Briefcase}
          accent="blue"
        />
        <KPICard
          label="Clientes Ativos"
          value={String(totalClients)}
          icon={Users}
          subtitle={`${totalLeads} leads este mês`}
          accent="purple"
        />
      </div>

      {/* Profit Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Resultado Operacional</h3>
            <span className={`text-2xl font-serif font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              R$ {profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-border">
            {revenue > 0 && (
              <div
                className="bg-emerald-500 transition-all duration-1000"
                style={{ width: `${Math.min((revenue / (revenue + expenses || 1)) * 100, 100)}%` }}
              />
            )}
            {expenses > 0 && (
              <div
                className="bg-red-500/70 transition-all duration-1000"
                style={{ width: `${Math.min((expenses / (revenue + expenses || 1)) * 100, 100)}%` }}
              />
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Receita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/70" /> Despesas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-white">Projetos Recentes</h2>
            <Link href="/projetos">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </div>
          <Card>
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
                  <tr>
                    <th className="px-6 py-4 font-normal">Cliente</th>
                    <th className="px-6 py-4 font-normal">Projeto</th>
                    <th className="px-6 py-4 font-normal">Progresso</th>
                    <th className="px-6 py-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentProjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">
                        Nenhum projeto cadastrado ainda.
                      </td>
                    </tr>
                  ) : (
                    recentProjects.map((p) => {
                      const total = p.tasks.length;
                      const done = p.tasks.filter((t) => t.status === "DONE").length;
                      const pct = total === 0 ? 0 : Math.round((done / total) * 100);

                      return (
                        <tr key={p.id} className="hover:bg-surface/80 transition-colors group">
                          <td className="px-6 py-4 font-medium text-white">{p.client.tradeName}</td>
                          <td className="px-6 py-4 text-muted-foreground">{p.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground">{pct}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                p.status === "EXECUTION" ? "success" :
                                p.status === "REVIEW" ? "warning" :
                                "default"
                              }
                            >
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Overdue Invoices */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Faturas Atrasadas
            </h2>
            <Card>
              <CardContent className="p-0">
                {overdueInvoices.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Nenhuma fatura atrasada. 🎉
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {overdueInvoices.map((inv) => (
                      <div key={inv.id} className="px-5 py-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-white">{inv.client.tradeName}</span>
                          <span className="text-[10px] font-mono text-red-400">
                            Venceu em {inv.dueDate.toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <span className="text-sm font-mono text-white">
                          R$ {inv.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-semibold text-white">Atividade Recente</h2>
            <Card className="h-full">
              <CardContent className="p-5 flex flex-col gap-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade registrada.</p>
                ) : (
                  recentActivity.map((log) => (
                    <div key={log.id} className="flex gap-3 text-sm pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white leading-snug">{log.description}</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-1">
                          {log.user?.name || "Sistema"} • {log.module} • {log.createdAt.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pending Invoices Banner */}
      {pending > 0 && (
        <Card className="border-amber-900/50 bg-amber-950/10">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {invoicesPending._count} fatura(s) pendente(s) totalizando{" "}
                  <span className="font-mono">R$ {pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
            </div>
            <Link href="/faturas">
              <Button variant="outline" size="sm" className="text-amber-400 border-amber-900 hover:bg-amber-950/30">
                Ver Faturas
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// KPI Card Component
function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  subtitle,
  accent,
}: {
  label: string;
  value: string;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
  subtitle?: string;
  accent: "emerald" | "red" | "blue" | "purple";
}) {
  const accentColors = {
    emerald: "bg-emerald-950/50 text-emerald-400",
    red: "bg-red-950/50 text-red-400",
    blue: "bg-blue-950/50 text-blue-400",
    purple: "bg-purple-950/50 text-purple-400",
  };

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className="text-xs font-mono text-muted uppercase tracking-wider">{label}</span>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${accentColors[accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <span className="text-3xl font-serif text-white">{value}</span>
        {(trend || subtitle) && (
          <div className="flex items-center gap-2">
            {trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-400" />}
            <span className="text-xs text-muted-foreground">{trendValue || subtitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
