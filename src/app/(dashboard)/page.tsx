import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Download } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral executiva da BlackDev.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
          <Button variant="primary">Nova Proposta</Button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Receita (Mês)</span>
              <Badge variant="success" className="gap-1">
                <ArrowUpRight className="w-3 h-3" />
                12.5%
              </Badge>
            </div>
            <span className="text-4xl font-serif text-white">R$ 84.200</span>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Despesas</span>
              <Badge variant="destructive" className="gap-1">
                <ArrowUpRight className="w-3 h-3" />
                4.2%
              </Badge>
            </div>
            <span className="text-4xl font-serif text-white">R$ 21.400</span>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Projetos Ativos</span>
            </div>
            <span className="text-4xl font-serif text-white">12</span>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">MRR</span>
              <Badge variant="success" className="gap-1">
                <ArrowUpRight className="w-3 h-3" />
                2.1%
              </Badge>
            </div>
            <span className="text-4xl font-serif text-white">R$ 14.800</span>
          </CardContent>
        </Card>
      </div>
      
      {/* Data Table Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold">Projetos Recentes</h2>
            <Button variant="ghost" size="sm">Ver todos</Button>
          </div>
          <Card>
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
                  <tr>
                    <th className="px-6 py-4 font-normal">Cliente</th>
                    <th className="px-6 py-4 font-normal">Projeto</th>
                    <th className="px-6 py-4 font-normal">Status</th>
                    <th className="px-6 py-4 font-normal text-right">Valor</th>
                    <th className="px-6 py-4 font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { client: "Clínica Dental Sorriso", project: "Site Institucional", status: "Em Andamento", value: "R$ 15.000" },
                    { client: "Advocacia XYZ", project: "Sistema de Gestão", status: "Atrasado", value: "R$ 45.000" },
                    { client: "Construtora Alfa", project: "Landing Page", status: "Concluído", value: "R$ 5.000" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface/80 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white">{row.client}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.project}</td>
                      <td className="px-6 py-4">
                        <Badge variant={row.status === "Atrasado" ? "destructive" : row.status === "Concluído" ? "success" : "default"}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">{row.value}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Activity Timeline (Placeholder) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold">Timeline</h2>
          </div>
          <Card className="h-full min-h-[400px]">
            <CardContent className="p-6 flex flex-col gap-6">
               <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                   <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
                   <div className="w-px h-full bg-border mt-2"></div>
                 </div>
                 <div className="flex flex-col gap-1 pb-4">
                   <span className="text-sm font-medium text-white">Proposta Aprovada</span>
                   <span className="text-xs text-muted-foreground">Clínica Dental Sorriso assinou a proposta comercial.</span>
                   <span className="text-[10px] font-mono text-muted mt-1">HÁ 2 HORAS</span>
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                   <div className="w-2 h-2 rounded-full bg-border mt-2"></div>
                 </div>
                 <div className="flex flex-col gap-1 pb-4">
                   <span className="text-sm font-medium text-muted-foreground">Reunião de Alinhamento</span>
                   <span className="text-xs text-muted-foreground">Call realizada com o CTO da Advocacia XYZ.</span>
                   <span className="text-[10px] font-mono text-muted mt-1">ONTEM, 14:30</span>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
