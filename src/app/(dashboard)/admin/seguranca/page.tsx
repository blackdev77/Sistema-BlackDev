import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, CheckCircle, XCircle, MonitorSmartphone, Clock } from "lucide-react";
import DeviceApprovalClient from "./DeviceApprovalClient";

export default function SecurityPanelPage() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Zero Trust Security</h1>
              <p className="text-muted-foreground mt-1 font-mono text-sm">Governança de Dispositivos e Sessões</p>
            </div>
            <Badge variant="destructive" className="bg-red-950 text-red-400 border-red-900/50">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Nível Máximo
            </Badge>
          </div>

          <SecurityData />

        </div>
      </div>
    </div>
  );
}

async function SecurityData() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Load pending requests where the current user is NOT the requester
  // (Meaning they are the one who needs to approve it)
  const pendingRequests = await prisma.deviceApprovalRequest.findMany({
    where: {
      status: "PENDING",
      requestedById: {
        not: session.user.id
      }
    },
    include: {
      requestedBy: true,
      device: true
    },
    orderBy: { createdAt: "desc" }
  });

  const recentEvents = await prisma.securityEvent.findMany({
    take: 10,
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Pending Approvals */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-serif text-white border-b border-border/50 pb-2">Aprovações Pendentes</h2>
        
        {pendingRequests.length === 0 ? (
          <div className="bg-surface border border-border p-8 rounded flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-500/50" />
            <p className="text-muted-foreground">Nenhuma tentativa de acesso desconhecido pendente de revisão.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((req) => (
              <Card key={req.id} className="border-red-900/50 bg-red-950/10">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MonitorSmartphone className="w-5 h-5 text-red-400" />
                      <h3 className="font-bold text-white text-lg">{req.requestedBy.name} tentou acessar</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      Navegador: {req.device.browser || 'Desconhecido'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Data: {req.createdAt.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  
                  {/* Client component for the interactive buttons */}
                  <DeviceApprovalClient requestId={req.id} deviceId={req.deviceId} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Security Audit Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif text-white border-b border-border/50 pb-2">Trilha de Segurança</h2>
        <div className="bg-surface border border-border rounded p-4 space-y-4">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento crítico recente.</p>
          ) : (
            recentEvents.map(event => (
              <div key={event.id} className="flex gap-3 text-sm pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">{event.description}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    Por: {event.user?.name || 'Sistema'} • {event.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
