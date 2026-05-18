"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createQuickTask } from "@/app/actions/task";
import { toast } from "sonner";

interface ProjectOption {
  id: string;
  name: string;
}

interface QuickTaskModalProps {
  projects: ProjectOption[];
}

export function QuickTaskModal({ projects }: QuickTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createQuickTask(formData);
    
    if (result.success) {
      toast.success("Tarefa criada com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar tarefa");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Nova Tarefa Rápida
      </Button>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Centered Modal */}
      <div 
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-background border border-border shadow-2xl transition-all duration-300 flex flex-col p-6 rounded-lg ${
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-border/50">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-serif font-bold text-white">Nova Tarefa Rápida</h2>
            <p className="text-sm text-muted-foreground">Cadastre uma nova tarefa e vincule-a instantaneamente a um projeto.</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-muted-foreground hover:text-white hover:bg-surface rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Título da Tarefa <span className="text-red-500">*</span></label>
              <input 
                name="title"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Revisar escopo de design com cliente"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Projeto <span className="text-red-500">*</span></label>
              <select 
                name="projectId"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                defaultValue=""
              >
                <option value="" disabled>Selecione o projeto correspondente...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Descrição (Opcional)</label>
              <textarea 
                name="description"
                rows={3}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow resize-none"
                placeholder="Escopo adicional, links ou instruções da tarefa..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Prioridade</label>
                <select 
                  name="priority"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue="MEDIUM"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Prazo de Entrega</label>
                <input 
                  name="dueDate"
                  type="date"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>
            </div>

            <input type="hidden" name="status" value="TODO" />
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
