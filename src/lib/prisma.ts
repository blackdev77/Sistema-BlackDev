import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const basePrisma = globalForPrisma.prisma ?? new PrismaClient()

// Prisma Extension for Automatic Audit Logging
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async create({ model, operation, args, query }) {
        const result = await query(args);
        try {
          await basePrisma.auditLog.create({
            data: {
              action: "CREATE",
              entityType: model,
              entityId: (result as any).id || "unknown",
              newValues: JSON.stringify(result),
              userId: null
            }
          });
        } catch (e) {
          console.error("Audit Log Failed:", e);
        }
        return result;
      },
      async update({ model, operation, args, query }) {
        const result = await query(args);
        try {
          await basePrisma.auditLog.create({
            data: {
              action: "UPDATE",
              entityType: model,
              entityId: (result as any).id || "unknown",
              newValues: JSON.stringify(result),
              userId: null
            }
          });
        } catch (e) {
          console.error("Audit Log Failed:", e);
        }
        return result;
      },
      async delete({ model, operation, args, query }) {
        const result = await query(args);
        try {
          await basePrisma.auditLog.create({
            data: {
              action: "DELETE",
              entityType: model,
              entityId: (result as any).id || "unknown",
              oldValues: JSON.stringify(result),
              userId: null
            }
          });
        } catch (e) {
          console.error("Audit Log Failed:", e);
        }
        return result;
      }
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma
