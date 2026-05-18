import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Building2, Mail, Phone, ExternalLink, Briefcase, Receipt, FileSignature, Activity, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditClientSlideOver } from "./EditClientSlideOver";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const client = await prisma.client.findUnique({
    where: { id: resolvedParams.id },
    include: {
      contacts: true,
      projects: {
        orderBy: { createdAt: "desc" }
      },
      contracts: {
        orderBy: { createdAt: "desc" }
      },
      invoices: {
        where: { deletedAt: null },
        orderBy: { dueDate: "asc" },
        take: 10
      }
    }
  });

  if (!client) {
    notFound();
  }

  // Compute a dynamic visual timeline of all activities
  const activities = [
    {
      id: "client-created",
      action: "Cliente Integrado",
      date: client.createdAt,
      description: `O perfil do cliente ${client.tradeName} foi estabelecido no cockpit.`
    },
    ...client.projects.map(p => ({
      id: `proj-${p.id}`,
      action: "Projeto Mapeado",
      date: p.createdAt,
      description: `Projeto "${p.name}" foi inicializado com status: ${p.status}.`
    })),
    ...client.contracts.map(c => ({
      id: `contract-${c.id}`,
      action: "Contrato Registrado",
      date: c.createdAt,
      description: `Minuta "${c.title}" no valor de R$ ${c.value.toLocaleString('pt-BR')} registrada.`
    })),
    ...client.invoices.map(i => ({
      id: `invoice-${i.id}`,
      action: `Fatura ${i.status === "PAID" ? "Liquidada" : "Gerada"}`,
      date: i.status === "PAID" && i.paidAt ? i.paidAt : i.createdAt,
      description: `Cobrança "${i.description}" no valor de R$ ${i.amount.toLocaleString('pt-BR')} está ${i.status}.`
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center shrink-0 overflow-hidden p-1.5 border border-border/50">
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={client.logoUrl} 
                alt={client.tradeName} 
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-10 h-10 text-black" />
            )}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-white tracking-tight">{client.tradeName}</h1>
              <Badge variant={client.status === 'ACTIVE' ? 'success' : 'warning'}>
                {client.status === 'ACTIVE' ? 'ATIVO' : client.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-0.5 text-sm font-mono text-muted-foreground">
              <span>Razão Social: {client.legalName}</span>
              <span>CNPJ: {client.document || "Não cadastrado"}</span>
              {client.address && <span>Endereço: {client.address}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <EditClientSlideOver client={client} />
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Contacts & Info) */}
        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-border pb-2">Contatos</h2>
            {client.contacts.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">Nenhum contato cadastrado.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {client.contacts.map(contact => (
                  <Card key={contact.id} className="bg-surface/50">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{contact.name}</span>
                          <span className="text-xs text-muted-foreground">{contact.role || "Contato"}</span>
                        </div>
                        {contact.isMain && <Badge variant="outline" className="text-[9px]">PRINCIPAL</Badge>}
                      </div>
                      <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground">
                        {contact.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {contact.email}</div>}
                        {contact.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {contact.phone}</div>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-border pb-2">Linha do Tempo</h2>
            <div className="relative pl-4 border-l border-border ml-2 flex flex-col gap-6">
              {activities.map(activity => (
                <div key={activity.id} className="flex flex-col gap-1 relative">
                  <div className="absolute w-2 h-2 bg-white rounded-full -left-[21px] top-1.5" />
                  <span className="text-sm font-medium text-white">{activity.action}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString('pt-BR')}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Projects, Contracts, Invoices) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Projects */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                Projetos Ativos
              </h2>
            </div>
            {client.projects.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">Nenhum projeto em andamento.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.projects.map(project => (
                  <Card key={project.id}>
                    <CardContent className="p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-white">{project.name}</span>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between text-[10px] font-mono text-muted uppercase tracking-wider">
                          <span>Progresso</span>
                          <span className="text-white">{project.status === "FINISHED" ? 100 : 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-border overflow-hidden">
                          <div className="h-full bg-white" style={{ width: `${project.status === "FINISHED" ? 100 : 0}%` }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Financial Overview */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                Faturas (Invoices)
              </h2>
            </div>
            {client.invoices.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">Nenhuma fatura pendente ou liquidada.</div>
            ) : (
              <Card>
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
                      <tr>
                        <th className="px-4 py-3 font-normal">Descrição</th>
                        <th className="px-4 py-3 font-normal">Valor</th>
                        <th className="px-4 py-3 font-normal">Vencimento</th>
                        <th className="px-4 py-3 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {client.invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-surface/80 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{invoice.description}</td>
                          <td className="px-4 py-3 font-mono text-xs">R$ {invoice.amount.toLocaleString('pt-BR')}</td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>{invoice.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Contracts */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-muted-foreground" />
                Contratos Assinados
              </h2>
            </div>
            {client.contracts.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">Nenhum contrato assinado.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {client.contracts.map(contract => (
                  <Card key={contract.id} className="bg-surface/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white">{contract.title}</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          Vínculo ativo
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-white">R$ {contract.value.toLocaleString('pt-BR')}</span>
                        <Badge variant="outline">{contract.status}</Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
