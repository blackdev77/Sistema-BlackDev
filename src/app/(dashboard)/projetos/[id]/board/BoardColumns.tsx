"use client";

import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { updateTaskStatus, createTask } from "@/app/actions/task";
import { toast } from "sonner";

const COLUMNS = [
  { id: "TODO", name: "A Fazer" },
  { id: "IN_PROGRESS", name: "Em Progresso" },
  { id: "REVIEW", name: "Revisão" },
  { id: "DONE", name: "Concluído" }
];

export function BoardColumns({ projectId, tasks }: { projectId: string, tasks: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleMove = (taskId: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateTaskStatus(taskId, projectId, newStatus);
      if (res.success) {
        toast.success("Tarefa atualizada");
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    startTransition(async () => {
      const res = await createTask(projectId, formData);
      if (res.success) {
        toast.success("Tarefa criada");
        form.reset();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="flex gap-6 h-full min-w-max">
      {COLUMNS.map((column, index) => {
        const columnTasks = tasks.filter(t => t.status === column.id);
        
        return (
          <div key={column.id} className="w-[300px] flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between shrink-0 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs text-white uppercase tracking-wider">{column.name}</h3>
                <span className="bg-surface text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">{columnTasks.length}</span>
              </div>
            </div>

            {column.id === "TODO" && (
              <form onSubmit={handleCreate} className="flex flex-col gap-2 p-3 bg-surface border border-border border-dashed rounded">
                <input 
                  name="title" 
                  placeholder="Nova tarefa..." 
                  required
                  className="bg-transparent border-none text-sm text-white focus:outline-none placeholder:text-muted-foreground"
                />
                <div className="flex justify-between items-center mt-2">
                  <select name="priority" className="text-[10px] bg-background border border-border text-white rounded px-1 py-0.5">
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                  <Button type="submit" variant="primary" size="sm" className="h-6 text-[10px] px-2" disabled={isPending}>
                    Adicionar
                  </Button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin">
              {columnTasks.map(task => (
                <Card key={task.id} className={`transition-colors ${isPending ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4 flex flex-col gap-3">
                    <span className="text-sm font-medium text-white leading-snug">{task.title}</span>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
                      <span className={`text-[10px] font-mono tracking-wider ${
                        task.priority === 'URGENT' ? 'text-red-400' : 
                        task.priority === 'HIGH' ? 'text-yellow-400' : 'text-muted-foreground'
                      }`}>
                        {task.priority}
                      </span>
                      
                      <div className="flex gap-1">
                        {index > 0 && (
                          <button 
                            onClick={() => handleMove(task.id, COLUMNS[index - 1].id)}
                            className="p-1 hover:bg-surface rounded text-muted-foreground hover:text-white"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {index < COLUMNS.length - 1 && (
                          <button 
                            onClick={() => handleMove(task.id, COLUMNS[index + 1].id)}
                            className="p-1 hover:bg-surface rounded text-muted-foreground hover:text-white"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
