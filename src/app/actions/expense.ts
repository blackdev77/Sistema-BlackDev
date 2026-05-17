"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createExpenseSchema = z.object({
  description: z.string().min(2, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.coerce.number().min(0.01, "O valor deve ser maior que zero"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
});

export async function createExpense(formData: FormData) {
  try {
    const data = {
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      amount: formData.get("amount"),
      dueDate: formData.get("dueDate") as string,
    };

    const parsed = createExpenseSchema.parse(data);

    await prisma.expense.create({
      data: {
        description: parsed.description,
        category: parsed.category,
        amount: parsed.amount,
        dueDate: new Date(parsed.dueDate),
        status: "PENDING"
      }
    });

    revalidatePath("/despesas");
    return { success: true };
  } catch (error) {
    console.error("Error creating expense:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Erro interno ao criar despesa." };
  }
}
