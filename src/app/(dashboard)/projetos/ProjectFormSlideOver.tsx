"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createProject } from "@/app/actions/project";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  tradeName: string;
}

interface ProjectFormSlideOverProps {
  clients: ClientOption[];
}

export function ProjectFormSlideOver({ clients }: ProjectFormSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createProject(formData);
    
    if (result.success) {
      toast.success("Projeto criado com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar projeto");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Novo Projeto
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Novo Projeto" 
        description="Cadastre um novo projeto operacional no sistema para acompanhamento técnico."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Identificação & Cliente</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nome do Projeto <span className="text-red-500">*</span></label>
              <input 
                name="name"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Landing Page Q3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Cliente <span className="text-red-500">*</span></label>
              <select 
                name="clientId"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                defaultValue=""
              >
                <option value="" disabled>Selecione um cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.tradeName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Descrição do Projeto</label>
              <textarea 
                name="description"
                rows={3}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow resize-none"
                placeholder="Detalhes sobre o escopo, tecnologia e entregáveis..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Configurações & Prazos</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Status Inicial</label>
                <select 
                  name="status"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue="PLANNING"
                >
                  <option value="PLANNING">Planejamento</option>
                  <option value="EXECUTION">Execução</option>
                  <option value="REVIEW">Revisão</option>
                  <option value="FINISHED">Finalizado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

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
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Progresso Inicial (%)</label>
              <input 
                name="progress"
                type="number"
                min="0"
                max="100"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: 0"
                defaultValue="0"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white">Data Início</label>
                <input 
                  name="startDate"
                  type="date"
                  className="w-full bg-surface border border-border px-1.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white">Data Fim</label>
                <input 
                  name="endDate"
                  type="date"
                  className="w-full bg-surface border border-border px-1.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white">Vencimento</label>
                <input 
                  name="dueDate"
                  type="date"
                  className="w-full bg-surface border border-border px-1.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
