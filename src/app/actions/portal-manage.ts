"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const enablePortalSchema = z.object({
  contactId: z.string().min(1),
  password: z.string().min(4, "Senha precisa ter ao menos 4 caracteres"),
});

export async function enablePortalAccess(formData: FormData) {
  try {
    const data = {
      contactId: formData.get("contactId") as string,
      password: formData.get("password") as string,
    };

    const parsed = enablePortalSchema.parse(data);

    await prisma.clientContact.update({
      where: { id: parsed.contactId },
      data: {
        portalAccess: true,
        passwordHash: parsed.password, // Plain text for prototype; bcrypt in prod
      },
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Erro ao habilitar acesso ao portal." };
  }
}

export async function disablePortalAccess(contactId: string) {
  try {
    await prisma.clientContact.update({
      where: { id: contactId },
      data: {
        portalAccess: false,
        passwordHash: null,
      },
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao revogar acesso." };
  }
}
