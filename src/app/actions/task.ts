"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(projectId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const priority = formData.get("priority") as string || "MEDIUM";

    if (!title || title.length < 2) throw new Error("Título inválido");

    await prisma.task.create({
      data: {
        projectId,
        title,
        priority,
        status: "TODO"
      }
    });

    revalidatePath(`/projetos/${projectId}/board`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar tarefa" };
  }
}

export async function updateTaskStatus(taskId: string, projectId: string, newStatus: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });

    revalidatePath(`/projetos/${projectId}/board`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erro ao atualizar status" };
  }
}

export async function createMilestone(projectId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const dateStr = formData.get("dueDate") as string;
    
    if (!title || !dateStr) throw new Error("Dados inválidos");

    await prisma.milestone.create({
      data: {
        projectId,
        title,
        dueDate: new Date(dateStr)
      }
    });

    revalidatePath(`/projetos/${projectId}/board`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar milestone" };
  }
}

export async function toggleMilestone(milestoneId: string, projectId: string, currentStatus: boolean) {
  try {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { isCompleted: !currentStatus }
    });

    revalidatePath(`/projetos/${projectId}/board`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar milestone" };
  }
}
