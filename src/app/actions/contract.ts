"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createContractSchema = z.object({
  clientId: z.string().uuid("Cliente selecionado é inválido"),
  projectId: z.string().uuid().optional().nullable().or(z.literal("")),
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  value: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  status: z.enum(["DRAFT", "PENDING_SIGNATURE", "SIGNED", "EXPIRED", "CANCELLED"]).default("DRAFT"),
  startsAt: z.date().optional().nullable(),
  endsAt: z.date().optional().nullable(),
});

export async function createContract(formData: FormData) {
  try {
    const rawProjectId = formData.get("projectId") as string;
    const valueRaw = formData.get("value") as string;
    const startsAtRaw = formData.get("startsAt") as string;
    const endsAtRaw = formData.get("endsAt") as string;

    const data = {
      clientId: formData.get("clientId") as string,
      projectId: rawProjectId === "" ? null : rawProjectId,
      title: formData.get("title") as string,
      value: valueRaw ? parseFloat(valueRaw.replace(",", ".")) : 0,
      status: (formData.get("status") as string || "DRAFT"),
      startsAt: startsAtRaw ? new Date(startsAtRaw) : null,
      endsAt: endsAtRaw ? new Date(endsAtRaw) : null,
    };

    const parsed = createContractSchema.parse(data);

    const contract = await prisma.contract.create({
      data: {
        clientId: parsed.clientId,
        projectId: parsed.projectId || null,
        title: parsed.title,
        value: parsed.value,
        status: parsed.status,
        startsAt: parsed.startsAt,
        endsAt: parsed.endsAt,
      },
    });

    revalidatePath("/contratos");
    revalidatePath("/financeiro");
    revalidatePath("/");
    
    return { success: true, contractId: contract.id };
  } catch (error) {
    console.error("Error creating contract:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar contrato." };
  }
}
