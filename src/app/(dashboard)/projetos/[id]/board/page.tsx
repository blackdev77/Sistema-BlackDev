import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ProjectBoardPage({ params }: { params: { id: string } }) {
  
  // Mock Columns for the Kanban Board
  const columns = [
    { id: 'BACKLOG', name: 'Backlog', count: 12 },
    { id: 'TODO', name: 'To Do (Sprint)', count: 4 },
    { id: 'IN_PROGRESS', name: 'In Progress', count: 2 },
    { id: 'REVIEW', name: 'Code Review', count: 1 },
    { id: 'DONE', name: 'Done', count: 8 },
  ];

  // Mock Tasks
  const tasks = [
    { id: 'T-1', title: 'Configurar Prisma Schema (SQLite)', column: 'DONE', priority: 'HIGH', tags: ['Backend'] },
    { id: 'T-2', title: 'Autenticação NextAuth v5', column: 'DONE', priority: 'HIGH', tags: ['Security'] },
    { id: 'T-3', title: 'Painel de Auditoria', column: 'REVIEW', priority: 'MEDIUM', tags: ['Frontend'] },
    { id: 'T-4', title: 'Módulo de Projetos (Kanban)', column: 'IN_PROGRESS', priority: 'URGENT', tags: ['Frontend'] },
    { id: 'T-5', title: 'Dashboard Financeiro', column: 'IN_PROGRESS', priority: 'HIGH', tags: ['Data'] },
    { id: 'T-6', title: 'Perfil 360 do Cliente', column: 'TODO', priority: 'MEDIUM', tags: ['CRM'] },
    { id: 'T-7', title: 'Exportação PDF de Faturas', column: 'BACKLOG', priority: 'LOW', tags: ['Feature'] },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-6 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-2">
          <Link href="/projetos" className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="w-3 h-3" />
            VOLTAR PARA PROJETOS
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">BlackDev OS (Internal)</h1>
            <Badge variant="success">EXECUTION</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-[10px] font-bold border-2 border-background z-20">GU</div>
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold border-2 border-background z-10">+3</div>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Board Layout */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          
          {columns.map(column => (
            <div key={column.id} className="w-[320px] flex flex-col gap-4 h-full">
              
              {/* Column Header */}
              <div className="flex items-center justify-between shrink-0 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs text-white uppercase tracking-wider">{column.name}</h3>
                  <span className="bg-surface text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">{column.count}</span>
                </div>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin">
                {tasks.filter(t => t.column === column.id).map(task => (
                  <Card key={task.id} className="cursor-grab hover:border-white/30 transition-colors active:cursor-grabbing">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-white leading-snug">{task.title}</span>
                        <button className="text-muted-foreground shrink-0 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
                        <span className={`text-[10px] font-mono tracking-wider ${
                          task.priority === 'URGENT' ? 'text-red-400' : 
                          task.priority === 'HIGH' ? 'text-yellow-400' : 'text-muted-foreground'
                        }`}>
                          {task.priority}
                        </span>
                        
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-[10px]">2</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            <span className="text-[10px]">1</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
