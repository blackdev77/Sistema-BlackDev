"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2 } from "lucide-react";
import { updateContract, deleteContract } from "@/app/actions/contract";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  tradeName: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface ContractData {
  id: string;
  title: string;
  clientId: string;
  projectId: string | null;
  value: number;
  status: string;
  startsAt: Date | null;
  endsAt: Date | null;
}

interface EditContractSlideOverProps {
  contract: ContractData;
  clients: ClientOption[];
  projects: ProjectOption[];
}

export function EditContractSlideOver({ contract, clients, projects }: EditContractSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Format dates for input type="date" (yyyy-MM-dd)
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateContract(contract.id, formData);
    
    if (result.success) {
      toast.success("Contrato atualizado com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao atualizar contrato");
    }
    setIsPending(false);
  }

  async function handleDelete() {
    setIsPending(true);
    const result = await deleteContract(contract.id);
    
    if (result.success) {
      toast.success("Contrato excluído com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao excluir contrato");
    }
    setIsPending(false);
    setShowConfirmDelete(false);
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-surface text-xs" onClick={() => setIsOpen(true)}>
        <Edit2 className="w-3 h-3 text-muted-foreground hover:text-white" />
        Editar
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          setShowConfirmDelete(false);
        }} 
        title="Editar Contrato" 
        description="Atualize as informações, valores e vigência do contrato legal."
      >
        <div className="flex flex-col gap-6 h-full justify-between">
          <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Identificação & Escopo</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Título do Contrato <span className="text-red-500">*</span></label>
                <input 
                  name="title"
                  defaultValue={contract.title}
                  required
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="Ex: Prestação de Serviços de Desenvolvimento Web 2026"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Cliente <span className="text-red-500">*</span></label>
                <select 
                  name="clientId"
                  defaultValue={contract.clientId}
                  required
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.tradeName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Projeto (Opcional)</label>
                <select 
                  name="projectId"
                  defaultValue={contract.projectId || ""}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                >
                  <option value="">Nenhum projeto vinculado</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Termos Financeiros e Vigência</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Valor do Contrato (R$) <span className="text-red-500">*</span></label>
                <input 
                  name="value"
                  type="number"
                  step="0.01"
                  defaultValue={contract.value}
                  required
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="Ex: 55000.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Status</label>
                <select 
                  name="status"
                  defaultValue={contract.status}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                >
                  <option value="DRAFT">Rascunho (Draft)</option>
                  <option value="PENDING_SIGNATURE">Assinatura Pendente</option>
                  <option value="SIGNED">Assinado (Vigente)</option>
                  <option value="EXPIRED">Expirado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Início da Vigência</label>
                  <input 
                    name="startsAt"
                    type="date"
                    defaultValue={formatDate(contract.startsAt)}
                    className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Fim da Vigência</label>
                  <input 
                    name="endsAt"
                    type="date"
                    defaultValue={formatDate(contract.endsAt)}
                    className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 flex justify-between gap-3 mt-6">
              <div>
                {!showConfirmDelete ? (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="primary" 
                      className="bg-red-600 hover:bg-red-700 text-xs px-3"
                      onClick={handleDelete}
                      disabled={isPending}
                    >
                      Confirmar
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-xs px-2"
                      onClick={() => setShowConfirmDelete(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Voltar</Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SlideOver>
    </>
  );
}
