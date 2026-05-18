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
  tier: z.enum(["STANDARD", "VIP", "ENTERPRISE"]).optional().default("STANDARD"),
});

const updateClientSchema = z.object({
  id: z.string().uuid("ID do cliente inválido"),
  legalName: z.string().min(2, "Razão Social é obrigatória"),
  tradeName: z.string().min(2, "Nome Fantasia é obrigatório"),
  document: z.string().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable().or(z.literal("")),
  logoUrl: z.string().optional().nullable().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
  tier: z.enum(["STANDARD", "VIP", "ENTERPRISE"]).optional().default("STANDARD"),
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
      tier: formData.get("tier") as string || "STANDARD",
    };

    const parsed = createClientSchema.parse(data);

    const client = await prisma.client.create({
      data: {
        legalName: parsed.legalName,
        tradeName: parsed.tradeName,
        document: parsed.document || null,
        tier: parsed.tier,
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
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar cliente." };
  }
}

export async function updateClient(clientId: string, formData: FormData) {
  try {
    const data = {
      id: clientId,
      legalName: formData.get("legalName") as string,
      tradeName: formData.get("tradeName") as string,
      document: formData.get("document") as string || null,
      address: formData.get("address") as string || null,
      logoUrl: formData.get("logoUrl") as string || null,
      status: (formData.get("status") as string || "ACTIVE") as any,
      tier: (formData.get("tier") as string || "STANDARD") as any,
    };

    const parsed = updateClientSchema.parse(data);

    await prisma.client.update({
      where: { id: clientId },
      data: {
        legalName: parsed.legalName,
        tradeName: parsed.tradeName,
        document: parsed.document || null,
        address: parsed.address || null,
        logoUrl: parsed.logoUrl || null,
        status: parsed.status,
        tier: parsed.tier,
      }
    });

    revalidatePath("/clientes");
    revalidatePath(`/clientes/${clientId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating client:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao atualizar cliente." };
  }
}
