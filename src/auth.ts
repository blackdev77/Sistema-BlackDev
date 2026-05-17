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

        // Hybrid check to support both bcrypt hashes and plain text (for seamless migrations)
        let passwordsMatch = false;
        if (user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2a$')) {
          passwordsMatch = await bcrypt.compare(credentials.password as string, user.passwordHash);
        } else {
          passwordsMatch = credentials.password === user.passwordHash;
        }

        if (passwordsMatch) {
          // === DEVICE FINGERPRINTING & MFA SECURITY ===
          const fingerprint = credentials.fingerprint as string;
          const userAgent = credentials.userAgent as string;

          if (fingerprint) {
            // Check if this device is trusted
            const device = await prisma.trustedDevice.findUnique({
              where: { fingerprint }
            });

            if (!device) {
              // BOOTSTRAP CHECK: If the system has 0 trusted devices, we auto-approve the first one
              // to prevent the chicken-and-egg deadlock where no admin can login to approve.
              const totalDevices = await prisma.trustedDevice.count({ where: { status: 'APPROVED' }});
              const isFirstEverDevice = totalDevices === 0;

              // This is a completely new device for this user
              const newDevice = await prisma.trustedDevice.create({
                data: {
                  userId: user.id,
                  fingerprint,
                  browser: userAgent,
                  status: isFirstEverDevice ? 'APPROVED' : 'PENDING'
                }
              });

              if (isFirstEverDevice) {
                 await prisma.securityEvent.create({
                    data: {
                       userId: user.id,
                       eventType: 'SYSTEM_BOOTSTRAP',
                       description: 'Primeiro dispositivo auto-aprovado no sistema.'
                    }
                 });
              } else {
                // Create explicit Approval Request
                await prisma.deviceApprovalRequest.create({
                  data: {
                    deviceId: newDevice.id,
                    requestedById: user.id,
                    status: 'PENDING'
                  }
                });

                // Log the attempt
                await prisma.loginHistory.create({
                  data: {
                    userId: user.id,
                    status: 'DEVICE_UNTRUSTED',
                    reason: 'New device requires approval'
                  }
                });

                // We return a custom error string that NextAuth will throw
                throw new Error('DEVICE_UNTRUSTED');
              }
            } else if (device.status !== 'APPROVED') {
              // Device exists but is not approved (PENDING, REVOKED, EXPIRED)
              await prisma.loginHistory.create({
                data: {
                  userId: user.id,
                  status: 'DEVICE_UNTRUSTED',
                  reason: `Device status is ${device.status}`
                }
              });
              
              throw new Error(`DEVICE_${device.status}`);
            }
          }

          // AUDIT LOG: Record successful login
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              status: 'SUCCESS',
              userAgent
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
