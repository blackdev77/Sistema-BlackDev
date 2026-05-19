"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function approveDevice(requestId: string, deviceId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Não autorizado");

    // Use a high-performance Prisma batch transaction to send all queries in a single database round-trip
    await prisma.$transaction([
      prisma.deviceApprovalRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          approvedById: userId,
          resolvedAt: new Date(),
        }
      }),
      prisma.trustedDevice.update({
        where: { id: deviceId },
        data: {
          status: "APPROVED",
          approvedById: userId,
          approvedAt: new Date(),
        }
      }),
      prisma.securityEvent.create({
        data: {
          userId: userId,
          eventType: "DEVICE_APPROVED",
          description: `Dispositivo ${deviceId} aprovado.`,
        }
      })
    ]);

    revalidatePath("/admin/seguranca");
    return { success: true };
  } catch (error: any) {
    console.error("Device approval failed:", error);
    return { success: false, error: error?.message || "Erro interno ao aprovar dispositivo" };
  }
}

export async function rejectDevice(requestId: string, deviceId: string, reason: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Não autorizado");

    // Use a high-performance Prisma batch transaction to avoid database timeouts
    await prisma.$transaction([
      prisma.deviceApprovalRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          approvedById: userId,
          resolvedAt: new Date(),
          justification: reason,
        }
      }),
      prisma.trustedDevice.update({
        where: { id: deviceId },
        data: {
          status: "REJECTED",
          approvedById: userId,
          approvedAt: new Date(),
        }
      }),
      prisma.securityEvent.create({
        data: {
          userId: userId,
          eventType: "DEVICE_REJECTED",
          description: `Dispositivo ${deviceId} rejeitado: ${reason}`,
        }
      })
    ]);

    revalidatePath("/admin/seguranca");
    return { success: true };
  } catch (error: any) {
    console.error("Device rejection failed:", error);
    return { success: false, error: error?.message || "Erro ao rejeitar dispositivo" };
  }
}

export async function revokeDevice(deviceId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Não autorizado");

    await prisma.trustedDevice.update({
      where: { id: deviceId },
      data: {
        status: "REVOKED",
      }
    });

    await prisma.securityEvent.create({
      data: {
        userId: userId,
        eventType: "DEVICE_REVOKED",
        description: `Dispositivo ${deviceId} revogado pelo administrador.`,
      }
    });

    revalidatePath("/admin/seguranca");
    return { success: true };
  } catch (error: any) {
    console.error("Device revocation failed:", error);
    return { success: false, error: error?.message || "Erro ao remover dispositivo" };
  }
}
