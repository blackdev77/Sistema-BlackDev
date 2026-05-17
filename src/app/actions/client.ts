"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createClientSchema = z.object({
  legalName: z.string().min(2, "Razão Social é obrigatória"),
  tradeName: z.string().min(2, "Nome Fantasia é obrigatório"),
  document: z.string().optional(),
  contactName: z.string().min(2, "Nome do contato principal é obrigatório"),
  contactEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

export async function createClient(formData: FormData) {
  try {
    const data = {
      legalName: formData.get("legalName") as string,
      tradeName: formData.get("tradeName") as string,
      document: formData.get("document") as string,
      contactName: formData.get("contactName") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    const parsed = createClientSchema.parse(data);

    const client = await prisma.client.create({
      data: {
        legalName: parsed.legalName,
        tradeName: parsed.tradeName,
        document: parsed.document || null,
        contacts: {
          create: {
            name: parsed.contactName,
            email: parsed.contactEmail || null,
            phone: parsed.contactPhone || null,
            isMain: true,
          }
        }
      }
    });

    revalidatePath("/clientes");
    return { success: true, clientId: client.id };
  } catch (error) {
    console.error("Error creating client:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Erro interno ao criar cliente." };
  }
}
