"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProjectSchema = z.object({
  clientId: z.string().uuid("Cliente selecionado é inválido"),
  name: z.string().min(3, "Nome do projeto deve ter pelo menos 3 caracteres"),
  description: z.string().optional().nullable(),
  status: z.enum(["PLANNING", "EXECUTION", "REVIEW", "FINISHED", "CANCELLED"]).default("PLANNING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  progress: z.number().min(0).max(100).default(0),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

export async function createProject(formData: FormData) {
  try {
    const progressRaw = formData.get("progress") as string;
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string;

    const data = {
      clientId: formData.get("clientId") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      status: (formData.get("status") as string || "PLANNING"),
      priority: (formData.get("priority") as string || "MEDIUM"),
      progress: progressRaw ? parseInt(progressRaw, 10) : 0,
      startDate: startDateRaw ? new Date(startDateRaw) : null,
      endDate: endDateRaw ? new Date(endDateRaw) : null,
    };

    const parsed = createProjectSchema.parse(data);

    const project = await prisma.project.create({
      data: {
        clientId: parsed.clientId,
        name: parsed.name,
        description: parsed.description,
        status: parsed.status,
        priority: parsed.priority,
        progress: parsed.progress,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
      },
    });

    revalidatePath("/projetos");
    revalidatePath("/");
    
    return { success: true, projectId: project.id };
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar projeto." };
  }
}
