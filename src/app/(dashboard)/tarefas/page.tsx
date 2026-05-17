import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { CheckSquare, Plus, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TarefasPage() {
  const tasks = await prisma.projectTask.findMany({
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-muted-foreground" />
            Tarefas Globais
          </h1>
          <p className="text-muted-foreground">Todas as tarefas de todos os projetos em execução.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa Rápida
          </Button>
        </div>
      </div>

      <Card>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-normal">Tarefa</th>
                <th className="px-6 py-4 font-normal">Projeto</th>
                <th className="px-6 py-4 font-normal">Prioridade</th>
                <th className="px-6 py-4 font-normal">Prazo (DueDate)</th>
                <th className="px-6 py-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    O backlog de tarefas globais está limpo.
                  </td>
                </tr>
              ) : tasks.map((task) => (
                <tr key={task.id} className="hover:bg-surface/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{task.project.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-mono tracking-wider ${
                      task.priority === 'URGENT' ? 'text-red-400' : 
                      task.priority === 'HIGH' ? 'text-yellow-400' : 'text-muted-foreground'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {task.dueDate ? task.dueDate.toLocaleDateString('pt-BR') : '--'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="outline">{task.status}</Badge>
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