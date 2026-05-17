"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProposalSchema = z.object({
  title: z.string().min(2, "Título é obrigatório"),
  leadId: z.string().optional(),
  totalValue: z.coerce.number().min(1, "O valor deve ser maior que zero"),
  paymentTerms: z.string().min(5, "Termos de pagamento obrigatórios"),
});

export async function createProposal(formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      leadId: formData.get("leadId") as string,
      totalValue: formData.get("totalValue"),
      paymentTerms: formData.get("paymentTerms") as string,
    };

    const parsed = createProposalSchema.parse(data);

    const proposal = await prisma.proposal.create({
      data: {
        title: parsed.title,
        leadId: parsed.leadId || null,
        totalValue: parsed.totalValue,
        paymentTerms: parsed.paymentTerms,
        status: "DRAFT"
      }
    });

    revalidatePath("/propostas");
    revalidatePath("/crm");
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
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { lead: true }
    });

    if (!proposal) throw new Error("Proposta não encontrada");

    // Use a transaction to convert Lead -> Client -> Project -> Contract
    await prisma.$transaction(async (tx) => {
      let clientId = proposal.clientId;

      // 1. Convert Lead to Client if it's tied to a Lead
      if (proposal.leadId && !clientId) {
        const client = await tx.client.create({
          data: {
            legalName: proposal.lead!.companyName,
            tradeName: proposal.lead!.companyName,
            contacts: {
              create: {
                name: proposal.lead!.contactName,
                email: proposal.lead!.email,
                phone: proposal.lead!.phone,
                isMain: true
              }
            }
          }
        });
        clientId = client.id;

        await tx.lead.update({
          where: { id: proposal.leadId },
          data: { 
            status: "FECHADO", 
            convertedToClientId: client.id 
          }
        });
      }

      if (!clientId) throw new Error("Não foi possível resolver o cliente.");

      // 2. Mark Proposal as ACCEPTED
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: "ACCEPTED", clientId }
      });

      // 3. Create Project
      const project = await tx.project.create({
        data: {
          clientId,
          proposalId: proposal.id,
          name: proposal.title,
          status: "PLANNING",
          description: `Projeto gerado automaticamente a partir da proposta ${proposal.title}`
        }
      });

      // 4. Create Draft Contract
      await tx.contract.create({
        data: {
          clientId,
          projectId: project.id,
          title: `Contrato: ${proposal.title}`,
          value: proposal.totalValue,
          status: "DRAFT"
        }
      });

    });

    revalidatePath("/propostas");
    revalidatePath("/projetos");
    revalidatePath("/clientes");
    revalidatePath("/crm");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error accepting proposal:", error);
    return { success: false, error: error.message || "Erro ao aprovar proposta" };
  }
}
