import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { role: true },
        });

        if (!user || !user.isActive) return null;

        // In production, we use bcrypt:
        // const passwordsMatch = await bcrypt.compare(credentials.password as string, user.passwordHash);
        
        // Since we seeded with plain text '123456' for the prototype:
        const passwordsMatch = credentials.password === user.passwordHash;

        if (passwordsMatch) {
          
          // AUDIT LOG: Record login
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              status: 'SUCCESS',
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
          };
        }

        // AUDIT LOG: Failed login
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            status: 'FAILED',
            reason: 'INVALID_PASSWORD'
          }
        });

        return null;
      },
    }),
  ],
});
