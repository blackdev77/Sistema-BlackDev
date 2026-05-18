"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const leadSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  contactName: z.string().min(2, "Nome do contato é obrigatório"),
  email: z.string().email("E-mail inválido").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable().or(z.literal("")),
  city: z.string().optional().nullable().or(z.literal("")),
  status: z.enum(["NOVO", "CONTACTADO", "REUNIAO", "PROPOSTA", "NEGOCIACAO", "FECHADO"]).default("NOVO"),
  potential: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  value: z.coerce.number().min(0).optional().nullable(),
});

export async function createLead(formData: FormData) {
  try {
    const valueRaw = formData.get("value") as string;
    const data = {
      companyName: formData.get("companyName") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      city: formData.get("city") as string || null,
      status: formData.get("status") as string || "NOVO",
      potential: formData.get("potential") as string || "MEDIUM",
      urgency: formData.get("urgency") as string || "MEDIUM",
      value: valueRaw ? parseFloat(valueRaw) : null,
    };

    const parsed = leadSchema.parse(data);

    const lead = await prisma.lead.create({
      data: {
        companyName: parsed.companyName,
        contactName: parsed.contactName,
        email: parsed.email,
        phone: parsed.phone,
        city: parsed.city,
        status: parsed.status,
        potential: parsed.potential,
        urgency: parsed.urgency,
        value: parsed.value,
      },
    });

    revalidatePath("/crm");
    revalidatePath("/");
    
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Error creating lead:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar lead." };
  }
}

export async function updateLead(leadId: string, formData: FormData) {
  try {
    const valueRaw = formData.get("value") as string;
    const data = {
      id: leadId,
      companyName: formData.get("companyName") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      city: formData.get("city") as string || null,
      status: formData.get("status") as string || "NOVO",
      potential: formData.get("potential") as string || "MEDIUM",
      urgency: formData.get("urgency") as string || "MEDIUM",
      value: valueRaw ? parseFloat(valueRaw) : null,
    };

    const updateSchema = leadSchema.extend({ id: z.string().uuid() });
    const parsed = updateSchema.parse({ ...data, id: leadId });

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        companyName: parsed.companyName,
        contactName: parsed.contactName,
        email: parsed.email,
        phone: parsed.phone,
        city: parsed.city,
        status: parsed.status,
        potential: parsed.potential,
        urgency: parsed.urgency,
        value: parsed.value,
      },
    });

    revalidatePath("/crm");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating lead:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao atualizar lead." };
  }
}

export async function deleteLead(leadId: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { deletedAt: new Date() }
    });

    revalidatePath("/crm");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Erro interno ao excluir lead." };
  }
}

export async function convertLeadToClient(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return { success: false, error: "Lead não encontrado." };
    }

    const client = await prisma.$transaction(async (tx) => {
      // 1. Create client
      const cl = await tx.client.create({
        data: {
          legalName: lead.companyName,
          tradeName: lead.companyName,
          contacts: {
            create: {
              name: lead.contactName,
              email: lead.email,
              phone: lead.phone,
              isMain: true
            }
          }
        }
      });

      // 2. Mark lead as converted
      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "FECHADO",
          convertedToClientId: cl.id
        }
      });

      return cl;
    });

    revalidatePath("/crm");
    revalidatePath("/clientes");
    revalidatePath("/");
    
    return { success: true, clientId: client.id };
  } catch (error) {
    console.error("Error converting lead:", error);
    return { success: false, error: "Erro interno ao converter lead para cliente." };
  }
}
