"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createTaskSchema = z.object({
  projectId: z.string().uuid("Projeto selecionado é inválido"),
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BACKLOG"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.date().optional().nullable(),
});

export async function createQuickTask(formData: FormData) {
  try {
    const dueDateRaw = formData.get("dueDate") as string;

    const data = {
      projectId: formData.get("projectId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      status: (formData.get("status") as string || "TODO"),
      priority: (formData.get("priority") as string || "MEDIUM"),
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    };

    const parsed = createTaskSchema.parse(data);

    const task = await prisma.projectTask.create({
      data: {
        projectId: parsed.projectId,
        title: parsed.title,
        description: parsed.description,
        status: parsed.status,
        priority: parsed.priority,
        dueDate: parsed.dueDate,
      },
    });

    revalidatePath("/tarefas");
    revalidatePath(`/projetos/${parsed.projectId}/board`);
    revalidatePath("/");
    
    return { success: true, taskId: task.id };
  } catch (error) {
    console.error("Error creating quick task:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Erro interno ao criar tarefa rápida." };
  }
}

export async function createTask(projectId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const priority = (formData.get("priority") as string || "MEDIUM") as any;

    if (!title || title.length < 2) {
      return { success: false, error: "Título da tarefa é obrigatório." };
    }

    const task = await prisma.projectTask.create({
      data: {
        projectId,
        title,
        status: "TODO",
        priority,
      }
    });

    revalidatePath("/tarefas");
    revalidatePath(`/projetos/${projectId}/board`);
    revalidatePath("/");
    
    return { success: true, taskId: task.id };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Erro interno ao criar tarefa." };
  }
}

export async function updateTaskStatus(taskId: string, projectId: string, newStatus: string) {
  try {
    await prisma.projectTask.update({
      where: { id: taskId },
      data: { status: newStatus }
    });

    revalidatePath("/tarefas");
    revalidatePath(`/projetos/${projectId}/board`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating task status:", error);
    return { success: false, error: "Erro interno ao atualizar tarefa." };
  }
}

export async function createMilestone(projectId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const dueDateRaw = formData.get("dueDate") as string;

    if (!title || title.length < 2) {
      return { success: false, error: "Título do marco é obrigatório." };
    }

    const milestone = await prisma.projectMilestone.create({
      data: {
        projectId,
        title,
        dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
        status: "PENDING",
      }
    });

    revalidatePath(`/projetos/${projectId}/board`);
    revalidatePath("/");

    return { success: true, milestoneId: milestone.id };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return { success: false, error: "Erro interno ao criar marco." };
  }
}

export async function toggleMilestone(id: string, projectId: string, currentStatus: boolean) {
  try {
    const newStatus = currentStatus ? "PENDING" : "COMPLETED";

    await prisma.projectMilestone.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath(`/projetos/${projectId}/board`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error toggling milestone status:", error);
    return { success: false, error: "Erro interno ao atualizar marco." };
  }
}
