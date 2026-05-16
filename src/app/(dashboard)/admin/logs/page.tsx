import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Search, Filter, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  
  // Fetching real data from SQLite
  const loginLogs = await prisma.loginHistory.findMany({
    orderBy: { loginAt: 'desc' },
    take: 10,
    include: { user: { select: { name: true, email: true } } }
  });

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 10,
    include: { user: { select: { name: true, email: true } } }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-muted-foreground" />
            Central de Auditoria
          </h1>
          <p className="text-muted-foreground">Monitoramento em tempo real de acessos e mutações no sistema.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar log (ID, IP ou Usuário)..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-72 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Login History Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-serif font-semibold">Histórico de Acessos</h2>
          </div>
          
          <Card>
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
                  <tr>
                    <th className="px-6 py-4 font-normal">Data/Hora</th>
                    <th className="px-6 py-4 font-normal">Usuário</th>
                    <th className="px-6 py-4 font-normal">IP Address</th>
                    <th className="px-6 py-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loginLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {log.loginAt.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{log.user?.name || "Desconhecido"}</span>
                          <span className="text-xs text-muted-foreground">{log.user?.email || "Sem e-mail"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={log.status === "SUCCESS" ? "success" : "destructive"}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {loginLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-mono text-xs">
                        Nenhum registro de acesso encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Audit Logs Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-serif font-semibold">Trilha de Auditoria (Caixa Preta)</h2>
          </div>
          
          <Card>
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
                  <tr>
                    <th className="px-6 py-4 font-normal">Timestamp</th>
                    <th className="px-6 py-4 font-normal">Usuário</th>
                    <th className="px-6 py-4 font-normal">Ação</th>
                    <th className="px-6 py-4 font-normal">Delta (Mutação)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-white">{log.user?.name || "Sistema"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit">{log.action}</Badge>
                          <span className="text-[10px] font-mono text-muted">{log.entityType} ({log.entityId.substring(0,8)}...)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          Ver Payload
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-mono text-xs">
                        A caixa preta está vazia. Nenhum dado foi mutado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
