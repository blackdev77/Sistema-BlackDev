import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Users, Plus, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({
    include: {
      contacts: { where: { isMain: true }, take: 1 }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-muted-foreground" />
            Clientes
          </h1>
          <p className="text-muted-foreground">Base de contas, contratos e histórico 360º.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-normal">Empresa</th>
                <th className="px-6 py-4 font-normal">CNPJ/Doc</th>
                <th className="px-6 py-4 font-normal">Contato Principal</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum cliente cadastrado no sistema.
                  </td>
                </tr>
              ) : clients.map((client) => {
                const mainContact = client.contacts[0];
                return (
                  <tr key={client.id} className="hover:bg-surface/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{client.tradeName}</span>
                        <span className="text-xs text-muted-foreground">{client.legalName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{client.document || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {mainContact ? (
                        <div className="flex flex-col">
                          <span className="text-white">{mainContact.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{mainContact.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Sem contato</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={client.status === 'ACTIVE' ? 'success' : 'outline'}>{client.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/clientes/${client.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 gap-2">
                          Perfil 360
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}