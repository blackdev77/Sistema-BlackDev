"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProposalService } from "@/lib/services/ProposalService";

const createProposalSchema = z.object({
  title: z.string().min(2, "Título é obrigatório"),
  leadId: z.string().optional().nullable().or(z.literal("")),
  clientId: z.string().optional().nullable().or(z.literal("")),
  totalValue: z.coerce.number().min(1, "O valor deve ser maior que zero"),
  paymentTerms: z.string().min(5, "Termos de pagamento obrigatórios"),
  validUntil: z.date().optional().nullable(),
  status: z.enum(["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"]).default("DRAFT"),
});

export async function createProposal(formData: FormData) {
  try {
    const validUntilRaw = formData.get("validUntil") as string;
    const statusRaw = formData.get("status") as string || "DRAFT";
    const leadIdRaw = formData.get("leadId") as string;
    const clientIdRaw = formData.get("clientId") as string;

    const data = {
      title: formData.get("title") as string,
      leadId: leadIdRaw === "" ? null : leadIdRaw,
      clientId: clientIdRaw === "" ? null : clientIdRaw,
      totalValue: formData.get("totalValue"),
      paymentTerms: formData.get("paymentTerms") as string,
      validUntil: validUntilRaw ? new Date(validUntilRaw) : null,
      status: statusRaw,
    };

    const parsed = createProposalSchema.parse(data);

    const proposal = await prisma.proposal.create({
      data: {
        title: parsed.title,
        leadId: parsed.leadId || null,
        clientId: parsed.clientId || null,
        totalValue: parsed.totalValue,
        paymentTerms: parsed.paymentTerms,
        validUntil: parsed.validUntil,
        status: parsed.status,
      }
    });

    revalidatePath("/propostas");
    revalidatePath("/crm");
    revalidatePath("/clientes");
    revalidatePath("/");
    
    return { success: true, proposalId: proposal.id };
  } catch (error) {
    console.error("Error creating proposal:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar proposta." };
  }
}

// Action for the Fluxo Lead -> Cliente -> Projeto
export async function acceptProposal(proposalId: string) {
  try {
    await ProposalService.acceptProposal(proposalId);

    revalidatePath("/propostas");
    revalidatePath("/projetos");
    revalidatePath("/clientes");
    revalidatePath("/crm");
    revalidatePath("/portal");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error accepting proposal:", error);
    return { success: false, error: error.message || "Erro ao aprovar proposta" };
  }
}

export async function rejectProposal(proposalId: string) {
  try {
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "REJECTED" }
    });

    revalidatePath("/propostas");
    revalidatePath("/crm");
    revalidatePath("/portal");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting proposal:", error);
    return { success: false, error: "Erro ao rejeitar proposta" };
  }
}
