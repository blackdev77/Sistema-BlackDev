import { basePrisma } from './prisma-client'

// Helper to get the current userId safely (works in Server Actions/Components)
async function getCurrentUserId() {
  try {
    const { auth } = await import('@/auth');
    const session = await auth();
    return session?.user?.id || null;
  } catch {
    // Fails silently if used outside of request context (like seeding or scripts)
    return null;
  }
}

// Prisma Extension for Automatic Audit Logging
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async findMany({ model, operation, args, query }) {
        args = args || {};
        const SOFT_DELETE_MODELS = ['Lead', 'Client', 'Proposal', 'Contract', 'Project', 'Invoice', 'Expense'];
        if (SOFT_DELETE_MODELS.includes(model)) {
          if (args.where && 'deletedAt' in args.where) {
             // Skip if explicitly requesting deletedAt
          } else {
             args.where = { ...args.where, deletedAt: null };
          }
        }
        return query(args);
      },
      async findFirst({ model, operation, args, query }) {
        args = args || {};
        const SOFT_DELETE_MODELS = ['Lead', 'Client', 'Proposal', 'Contract', 'Project', 'Invoice', 'Expense'];
        if (SOFT_DELETE_MODELS.includes(model)) {
          if (args.where && 'deletedAt' in args.where) {
             // Skip if explicitly requesting deletedAt
          } else {
             args.where = { ...args.where, deletedAt: null };
          }
        }
        return query(args);
      },
      async findUnique({ model, operation, args, query }) {
        const result = await query(args);
        const SOFT_DELETE_MODELS = ['Lead', 'Client', 'Proposal', 'Contract', 'Project', 'Invoice', 'Expense'];
        if (SOFT_DELETE_MODELS.includes(model)) {
          // If the record exists but has been soft-deleted, act as if it wasn't found
          if (result && (result as any).deletedAt) {
             return null;
          }
        }
        return result;
      },
      async create({ model, operation, args, query }) {
        const result = await query(args);
        const userId = await getCurrentUserId();
        try {
          await basePrisma.auditLog.create({
            data: {
              action: "CREATE",
              entityType: model,
              entityId: (result as any).id || "unknown",
              newValues: JSON.stringify(result),
              userId
            }
          });
        } catch (e) {
          console.error("Audit Log Failed:", e);
        }
        return result;
      },
      async update({ model, operation, args, query }) {
        const result = await query(args);
        const userId = await getCurrentUserId();
        try {
          await basePrisma.auditLog.create({
            data: {
              action: "UPDATE",
              entityType: model,
              entityId: (result as any).id || "unknown",
              newValues: JSON.stringify(result),
              userId
            }
          });
        } catch (e) {
          console.error("Audit Log Failed:", e);
        }
        return result;
      },
      async delete({ model, operation, args, query }) {
        // Implement Soft Delete natively if the model supports it
        // We can't easily introspect Prisma models at runtime in extensions without Prisma.dmmf,
        // so we will just log the delete as usual, and the actual soft-delete logic will be handled
        // in the application code (update: { deletedAt: new Date() }).
        const result = await query(args);
        const userId = await getCurrentUserId();
        try {
          await basePrisma.auditLog.create({
            data: {
              action: "DELETE",
              entityType: model,
              entityId: (result as any).id || "unknown",
              oldValues: JSON.stringify(result),
              userId
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
