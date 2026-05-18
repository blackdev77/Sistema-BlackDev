"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { updateLead, deleteLead, convertLeadToClient } from "@/app/actions/lead";
import { toast } from "sonner";
import { Trash2, UserCheck, ShieldAlert } from "lucide-react";

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
  potential: string;
  urgency: string;
  value: number | null;
  convertedToClientId: string | null;
}

interface LeadDetailsSlideOverProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailsSlideOver({ lead, isOpen, onClose }: LeadDetailsSlideOverProps) {
  const [isPending, setIsPending] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleUpdate(formData: FormData) {
    setIsPending(true);
    const result = await updateLead(lead.id, formData);
    if (result.success) {
      toast.success("Lead atualizado com sucesso!");
      onClose();
    } else {
      toast.error(result.error || "Erro ao atualizar lead");
    }
    setIsPending(false);
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;
    setIsDeleting(true);
    const result = await deleteLead(lead.id);
    if (result.success) {
      toast.success("Lead excluído com sucesso!");
      onClose();
    } else {
      toast.error(result.error || "Erro ao excluir lead");
    }
    setIsDeleting(false);
  }

  async function handleConvert() {
    setIsConverting(true);
    const result = await convertLeadToClient(lead.id);
    if (result.success) {
      toast.success("Lead convertido em Cliente com sucesso!");
      onClose();
    } else {
      toast.error(result.error || "Erro ao converter lead");
    }
    setIsConverting(false);
  }

  return (
    <SlideOver 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Detalhes do Lead" 
      description={`Gerencie as informações e o status comercial de ${lead.companyName}`}
    >
      <form action={handleUpdate} className="flex flex-col gap-6 h-full pb-12">
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Dados da Empresa & Contato</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Nome da Empresa <span className="text-red-500">*</span></label>
            <input 
              name="companyName"
              defaultValue={lead.companyName}
              required
              className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Nome do Contato <span className="text-red-500">*</span></label>
            <input 
              name="contactName"
              defaultValue={lead.contactName}
              required
              className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">E-mail</label>
              <input 
                name="email"
                type="email"
                defaultValue={lead.email || ""}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="exemplo@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Telefone</label>
              <input 
                name="phone"
                defaultValue={lead.phone || ""}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Cidade</label>
            <input 
              name="city"
              defaultValue={lead.city || ""}
              className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              placeholder="São Paulo - SP"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Oportunidade & Pipeline</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Status</label>
              <select 
                name="status"
                defaultValue={lead.status}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              >
                <option value="NOVO">Novo</option>
                <option value="CONTACTADO">Contactado</option>
                <option value="REUNIAO">Reunião</option>
                <option value="PROPOSTA">Proposta</option>
                <option value="NEGOCIACAO">Negociação</option>
                <option value="FECHADO">Fechado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Valor Estimado (R$)</label>
              <input 
                name="value"
                type="number"
                step="0.01"
                defaultValue={lead.value || 0}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Potencial</label>
              <select 
                name="potential"
                defaultValue={lead.potential}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              >
                <option value="LOW">Baixo</option>
                <option value="MEDIUM">Médio</option>
                <option value="HIGH">Alto</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Urgência</label>
              <select 
                name="urgency"
                defaultValue={lead.urgency}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Ações de Conversão & Operação</h3>
          
          <div className="flex gap-2">
            {!lead.convertedToClientId ? (
              <Button 
                type="button" 
                variant="primary" 
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-500 border-none"
                onClick={handleConvert}
                disabled={isConverting}
              >
                <UserCheck className="w-4 h-4" />
                {isConverting ? "Convertendo..." : "Converter para Cliente"}
              </Button>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 p-2 bg-emerald-950/20 border border-emerald-900 rounded text-emerald-400 text-xs font-mono">
                <UserCheck className="w-4 h-4" />
                CONVERTIDO EM CLIENTE
              </div>
            )}

            <Button 
              type="button" 
              variant="outline" 
              className="gap-2 text-red-400 border-red-900/50 hover:bg-red-950/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
          <Button type="button" variant="ghost" onClick={onClose}>Fechar</Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
