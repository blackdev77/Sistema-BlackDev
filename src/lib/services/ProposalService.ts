import { prisma } from "@/lib/prisma";

export class ProposalService {
  /**
   * Accepts a proposal and automatically generates the downstream entities:
   * Client (if converted from Lead), Project, and Draft Contract.
   */
  static async acceptProposal(proposalId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { lead: true }
    });

    if (!proposal) throw new Error("Proposta não encontrada");

    // Use a transaction to convert Lead -> Client -> Project -> Contract
    return await prisma.$transaction(async (tx) => {
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
      const updatedProposal = await tx.proposal.update({
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

      return { proposal: updatedProposal, project };
    });
  }
}
