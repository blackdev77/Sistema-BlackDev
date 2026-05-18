"use client";

import { useTransition } from "react";
import { revokeDevice } from "@/app/actions/security";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeviceRevokeClient({ deviceId }: { deviceId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRevoke = () => {
    if (!confirm("Tem certeza que deseja remover a autorização deste dispositivo? Ele será deslogado e bloqueado imediatamente.")) {
      return;
    }

    startTransition(async () => {
      const res = await revokeDevice(deviceId);
      if (res.success) {
        toast.success("Dispositivo removido.", {
          description: "Acesso revogado com sucesso."
        });
      } else {
        toast.error("Erro ao remover", { description: res.error });
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8" 
      onClick={handleRevoke}
      disabled={isPending}
    >
      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
      Remover
    </Button>
  );
}
