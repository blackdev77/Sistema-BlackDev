import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Users, Plus, Search, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-muted-foreground" />
            Gestão de Equipe
          </h1>
          <p className="text-muted-foreground">Controle de acessos e permissões (RBAC).</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Colaborador
          </Button>
        </div>
      </div>

      <Card>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-normal">Nome</th>
                <th className="px-6 py-4 font-normal">Email (Login)</th>
                <th className="px-6 py-4 font-normal">Nível de Acesso (Role)</th>
                <th className="px-6 py-4 font-normal">Criado em</th>
                <th className="px-6 py-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="gap-1.5 border-white/20 text-white">
                      <Shield className="w-3 h-3 text-muted-foreground" />
                      {user.role.name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {user.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={user.isActive ? 'success' : 'destructive'}>
                      {user.isActive ? 'ATIVO' : 'BLOQUEADO'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}