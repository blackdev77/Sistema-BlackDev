"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createLeadSchema = z.object({
  companyName: z.string().min(2, "Empresa é obrigatória"),
  contactName: z.string().min(2, "Nome do contato é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  potential: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  sourceId: z.string().optional().or(z.literal("")),
  value: z.coerce.number().optional().default(0),
});

export async function createLead(formData: FormData) {
  try {
    const data = {
      companyName: formData.get("companyName") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      potential: formData.get("potential") as string || "MEDIUM",
      urgency: formData.get("urgency") as string || "MEDIUM",
      sourceId: formData.get("sourceId") as string,
      value: formData.get("value"),
    };

    const parsed = createLeadSchema.parse(data);

    await prisma.lead.create({
      data: {
        companyName: parsed.companyName,
        contactName: parsed.contactName,
        email: parsed.email || null,
        phone: parsed.phone || null,
        city: parsed.city || null,
        potential: parsed.potential,
        urgency: parsed.urgency,
        sourceId: parsed.sourceId ? parsed.sourceId : null,
        value: parsed.value,
        status: "NOVO"
      }
    });

    revalidatePath("/crm");
    return { success: true };
  } catch (error) {
    console.error("Error creating lead:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar lead." };
  }
}
