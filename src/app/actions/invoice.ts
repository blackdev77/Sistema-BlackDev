"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createInvoiceSchema = z.object({
  clientId: z.string().uuid("Selecione um cliente válido"),
  description: z.string().min(2, "Descrição é obrigatória"),
  amount: z.coerce.number().min(0.01, "O valor deve ser maior que zero"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
});

export async function createInvoice(formData: FormData) {
  try {
    const data = {
      clientId: formData.get("clientId") as string,
      description: formData.get("description") as string,
      amount: formData.get("amount"),
      dueDate: formData.get("dueDate") as string,
    };

    const parsed = createInvoiceSchema.parse(data);

    await prisma.invoice.create({
      data: {
        clientId: parsed.clientId,
        description: parsed.description,
        amount: parsed.amount,
        dueDate: new Date(parsed.dueDate),
        status: "PENDING"
      }
    });

    revalidatePath("/faturas");
    return { success: true };
  } catch (error) {
    console.error("Error creating invoice:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar fatura." };
  }
}
