"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(leadId: string, newStatus: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: newStatus }
    });
    
    revalidatePath("/crm");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Erro ao atualizar status." };
  }
}
