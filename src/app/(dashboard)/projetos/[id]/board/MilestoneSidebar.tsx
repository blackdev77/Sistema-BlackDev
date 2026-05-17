"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Flag } from "lucide-react";
import { createMilestone, toggleMilestone } from "@/app/actions/task";
import { toast } from "sonner";

export function MilestoneSidebar({ projectId, milestones }: { projectId: string, milestones: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    startTransition(async () => {
      const res = await createMilestone(projectId, formData);
      if (res.success) {
        toast.success("Milestone criado");
        form.reset();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleMilestone(id, projectId, currentStatus);
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2 border-b border-border pb-3 shrink-0">
        <Flag className="w-4 h-4 text-emerald-400" />
        <h3 className="font-mono text-sm text-white uppercase tracking-wider">Milestones</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin">
        {milestones.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">Nenhum marco definido.</p>
        ) : (
          milestones.map(m => (
            <div 
              key={m.id} 
              className={`flex items-start gap-3 p-3 rounded border transition-all cursor-pointer ${
                m.isCompleted ? 'bg-emerald-950/10 border-emerald-900/30 opacity-60' : 'bg-surface border-border hover:border-white/20'
              }`}
              onClick={() => handleToggle(m.id, m.isCompleted)}
            >
              {m.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-1">
                <span className={`text-sm ${m.isCompleted ? 'text-muted-foreground line-through' : 'text-white'}`}>
                  {m.title}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {m.dueDate.toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="shrink-0 pt-4 border-t border-border">
        <form onSubmit={handleCreate} className="flex flex-col gap-2">
          <input 
            name="title" 
            placeholder="Nome do marco..." 
            required
            className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none"
          />
          <input 
            name="dueDate" 
            type="date"
            required
            className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none"
          />
          <Button type="submit" variant="outline" size="sm" className="w-full mt-2" disabled={isPending}>
            Criar Milestone
          </Button>
        </form>
      </div>
    </div>
  );
}
