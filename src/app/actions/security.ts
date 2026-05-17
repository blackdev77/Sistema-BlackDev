"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function approveDevice(requestId: string, deviceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Não autorizado");

    // Start a transaction: Update Request, Update Device, Record Event
    await prisma.$transaction(async (tx) => {
      await tx.deviceApprovalRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          approvedById: session.user.id,
          resolvedAt: new Date(),
        }
      });

      await tx.trustedDevice.update({
        where: { id: deviceId },
        data: {
          status: "APPROVED",
          approvedById: session.user.id,
          approvedAt: new Date(),
        }
      });

      await tx.securityEvent.create({
        data: {
          userId: session.user.id,
          eventType: "DEVICE_APPROVED",
          description: `Dispositivo ${deviceId} aprovado.`,
        }
      });
    });

    revalidatePath("/admin/seguranca");
    return { success: true };
  } catch (error) {
    console.error("Device approval failed:", error);
    return { success: false, error: "Erro interno ao aprovar dispositivo" };
  }
}

export async function rejectDevice(requestId: string, deviceId: string, reason: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Não autorizado");

    await prisma.$transaction(async (tx) => {
      await tx.deviceApprovalRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          approvedById: session.user.id,
          resolvedAt: new Date(),
          justification: reason,
        }
      });

      await tx.trustedDevice.update({
        where: { id: deviceId },
        data: {
          status: "REJECTED",
          approvedById: session.user.id,
          approvedAt: new Date(),
        }
      });

      await tx.securityEvent.create({
        data: {
          userId: session.user.id,
          eventType: "DEVICE_REJECTED",
          description: `Dispositivo ${deviceId} rejeitado: ${reason}`,
        }
      });
    });

    revalidatePath("/admin/seguranca");
    return { success: true };
  } catch (error) {
    console.error("Device rejection failed:", error);
    return { success: false, error: "Erro ao rejeitar dispositivo" };
  }
}
