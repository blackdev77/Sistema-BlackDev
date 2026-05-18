"use client";

import { useTransition } from "react";
import { acceptProposal, rejectProposal } from "@/app/actions/proposal";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export function ProposalActions({ proposalId, status }: { proposalId: string, status: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    if (confirm("Tem certeza que deseja aceitar formalmente esta proposta? Isso iniciará a operação do projeto.")) {
      startTransition(async () => {
        const res = await acceptProposal(proposalId);
        if (res.success) {
          toast.success("Proposta aceita com sucesso!");
        } else {
          toast.error(res.error || "Erro ao aceitar proposta.");
        }
      });
    }
  };

  const handleReject = () => {
    if (confirm("Tem certeza que deseja rejeitar esta proposta?")) {
      startTransition(async () => {
        const res = await rejectProposal(proposalId);
        if (res.success) {
          toast.success("Proposta rejeitada.");
        } else {
          toast.error(res.error || "Erro ao rejeitar proposta.");
        }
      });
    }
  };

  if (status !== "SENT" && status !== "VIEWED") return null;

  return (
    <div className="flex gap-2 mt-4 shrink-0">
      <Button 
        variant="primary" 
        size="sm" 
        onClick={handleAccept} 
        disabled={isPending}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 px-3"
      >
        {isPending ? "Aprovando..." : "Aceitar Proposta"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReject} 
        disabled={isPending}
        className="text-red-400 border-red-950/50 hover:bg-red-950/20 text-xs py-1 px-3"
      >
        Rejeitar
      </Button>
    </div>
  );
}
