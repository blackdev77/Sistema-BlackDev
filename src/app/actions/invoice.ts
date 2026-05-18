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
      amount: formData.get("amount") as string,
      dueDate: formData.get("dueDate") as string,
    };

    const parsed = createInvoiceSchema.parse(data);

    const invoice = await prisma.invoice.create({
      data: {
        clientId: parsed.clientId,
        description: parsed.description,
        amount: parsed.amount,
        dueDate: new Date(parsed.dueDate),
        status: "PENDING"
      }
    });

    revalidatePath("/faturas");
    revalidatePath("/financeiro");
    revalidatePath("/");

    return { success: true, invoiceId: invoice.id };
  } catch (error) {
    console.error("Error creating invoice:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar fatura." };
  }
}

export async function markInvoiceAsPaid(invoiceId: string, paymentMethod: string = "PIX") {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return { success: false, error: "Fatura não encontrada." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update invoice to PAID
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PAID",
          paidAt: new Date()
        }
      });

      // 2. Create payment record
      await tx.payment.create({
        data: {
          invoiceId: invoiceId,
          amount: invoice.amount,
          method: paymentMethod,
          paidAt: new Date()
        }
      });
    });

    revalidatePath("/faturas");
    revalidatePath("/financeiro");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return { success: false, error: "Erro interno ao liquidar fatura." };
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { deletedAt: new Date() }
    });

    revalidatePath("/faturas");
    revalidatePath("/financeiro");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Erro interno ao excluir fatura." };
  }
}
