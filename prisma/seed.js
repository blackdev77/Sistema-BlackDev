const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrador do sistema com acesso irrestrito',
    },
  })

  const comercialRole = await prisma.role.upsert({
    where: { name: 'Comercial' },
    update: {},
    create: {
      name: 'Comercial',
      description: 'Equipe de Vendas e CRM',
    },
  })

  // 2. Create Permissions
  const permViewAudit = await prisma.permission.upsert({
    where: { action: 'view:audit_logs' },
    update: {},
    create: {
      action: 'view:audit_logs',
      description: 'Visualizar logs do sistema',
      module: 'SECURITY'
    },
  })

  // 3. Assign Permission to Role
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: permViewAudit.id,
      }
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: permViewAudit.id,
    }
  })

  // 4. Create Master Admin Users
  // Superlogin BlackDev
  const blackdev = await prisma.user.upsert({
    where: { email: 'admin@blackdev.com' },
    update: {},
    create: {
      name: 'BlackDev OS (SuperAdmin)',
      email: 'admin@blackdev.com',
      passwordHash: '123456',
      roleId: adminRole.id,
    },
  })

  // Gustavo
  const gustavo = await prisma.user.upsert({
    where: { email: 'gustavo@blackdev.com' },
    update: { name: 'Gustavo' },
    create: {
      name: 'Gustavo',
      email: 'gustavo@blackdev.com',
      passwordHash: '123456',
      roleId: adminRole.id,
    },
  })

  // Edmundo
  const edmundo = await prisma.user.upsert({
    where: { email: 'edmundo@blackdev.com' },
    update: { name: 'Edmundo' },
    create: {
      name: 'Edmundo',
      email: 'edmundo@blackdev.com',
      passwordHash: '123456',
      roleId: adminRole.id,
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
