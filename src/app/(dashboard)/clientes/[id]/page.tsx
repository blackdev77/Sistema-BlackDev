import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Building2, Mail, Phone, ExternalLink, Briefcase, Receipt, FileSignature, Activity, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  
  // Mocking the complex client profile data
  const client = {
    id: params.id,
    tradeName: 'TechCorp S/A',
    legalName: 'TechCorp Soluções Tecnológicas LTDA',
    document: '12.345.678/0001-99',
    status: 'ACTIVE',
    contacts: [
      { id: '1', name: 'Roberto Silva', role: 'CEO', email: 'roberto@techcorp.com.br', phone: '+55 11 99999-9999', isMain: true },
      { id: '2', name: 'Ana Costa', role: 'CTO', email: 'ana@techcorp.com.br', phone: '+55 11 88888-8888', isMain: false }
    ],
    projects: [
      { id: '1', name: 'Landing Page Q3', status: 'REVIEW', progress: 95 },
      { id: '2', name: 'E-commerce App', status: 'PLANNING', progress: 10 }
    ],
    contracts: [
      { id: '1', title: 'Desenvolvimento Web 2026', value: 55000, status: 'SIGNED', signedAt: new Date('2026-01-10') }
    ],
    invoices: [
      { id: '1', description: 'Sprint 1 - App', amount: 15000, status: 'PAID', dueDate: new Date('2026-05-10') },
      { id: '2', description: 'Sprint 2 - App', amount: 15000, status: 'PENDING', dueDate: new Date('2026-05-25') },
    ],
    activities: [
      { id: '1', action: 'Fatura Gerada', date: new Date('2026-05-01'), description: 'Fatura gerada no valor de R$ 15.000 (Sprint 2)' },
      { id: '2', action: 'Reunião Realizada', date: new Date('2026-04-20'), description: 'Alinhamento de escopo do E-commerce' },
      { id: '3', action: 'Contrato Assinado', date: new Date('2026-01-10'), description: 'Contrato Desenvolvimento Web assinado digitalmente' },
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center shrink-0">
            <Building2 className="w-10 h-10 text-black" />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-white tracking-tight">{client.tradeName}</h1>
              <Badge variant="success">ATIVO</Badge>
            </div>
            <div className="flex flex-col gap-0.5 text-sm font-mono text-muted-foreground">
              <span>Razão Social: {client.legalName}</span>
              <span>CNPJ: {client.document}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">Editar Cliente</Button>
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
            <div className="flex flex-col gap-4">
              {client.contacts.map(contact => (
                <Card key={contact.id} className="bg-surface/50">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{contact.name}</span>
                        <span className="text-xs text-muted-foreground">{contact.role}</span>
                      </div>
                      {contact.isMain && <Badge variant="outline" className="text-[9px]">PRINCIPAL</Badge>}
                    </div>
                    <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {contact.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {contact.phone}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-border pb-2">Linha do Tempo</h2>
            <div className="relative pl-4 border-l border-border ml-2 flex flex-col gap-6">
              {client.activities.map(activity => (
                <div key={activity.id} className="flex flex-col gap-1 relative">
                  <div className="absolute w-2 h-2 bg-white rounded-full -left-[21px] top-1.5" />
                  <span className="text-sm font-medium text-white">{activity.action}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {activity.date.toLocaleDateString('pt-BR')}
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
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-border overflow-hidden">
                        <div className="h-full bg-white" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                Faturas (Invoices)
              </h2>
            </div>
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
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{invoice.dueDate.toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>{invoice.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Contracts */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-muted-foreground" />
                Contratos Assinados
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {client.contracts.map(contract => (
                <Card key={contract.id} className="bg-surface/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-white">{contract.title}</span>
                      <span className="text-xs font-mono text-muted-foreground">
                        Assinado em: {contract.signedAt?.toLocaleDateString('pt-BR')}
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
          </div>

        </div>

      </div>
    </div>
  );
}
