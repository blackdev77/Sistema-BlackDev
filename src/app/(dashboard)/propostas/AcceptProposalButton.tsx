"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { acceptProposal } from "@/app/actions/proposal";
import { toast } from "sonner";

export function AcceptProposalButton({ proposalId }: { proposalId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleAccept() {
    if (!confirm("Aprovar proposta? Isso irá gerar o Cliente, o Projeto e o Contrato base automaticamente.")) return;

    startTransition(async () => {
      const result = await acceptProposal(proposalId);
      if (result.success) {
        toast.success("Proposta aprovada!", {
          description: "Cliente, Projeto e Contrato gerados com sucesso."
        });
      } else {
        toast.error(result.error || "Erro ao aprovar proposta");
      }
    });
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="text-emerald-400 border-emerald-900 hover:bg-emerald-950/30"
      onClick={handleAccept}
      disabled={isPending}
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      {isPending ? "Processando..." : "Dar Aceite"}
    </Button>
  );
}
