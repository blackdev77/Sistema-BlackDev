const bcrypt = require('bcryptjs')
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

  // Hash secure passwords using bcrypt
  const salt = bcrypt.genSaltSync(10)
  const hashedAdmin = bcrypt.hashSync('BlackDev#2026!Admin', salt)
  const hashedGustavo = bcrypt.hashSync('BlackDev#2026!Gustavo', salt)
  const hashedEdmundo = bcrypt.hashSync('BlackDev#2026!Edmundo', salt)

  // 4. Create Master Admin Users
  // Superlogin BlackDev
  const blackdev = await prisma.user.upsert({
    where: { email: 'admin@blackdev.com' },
    update: {
      passwordHash: hashedAdmin
    },
    create: {
      name: 'BlackDev OS (SuperAdmin)',
      email: 'admin@blackdev.com',
      passwordHash: hashedAdmin,
      roleId: adminRole.id,
    },
  })

  // Gustavo
  const gustavo = await prisma.user.upsert({
    where: { email: 'gustavo@blackdev.com' },
    update: { 
      name: 'Gustavo',
      passwordHash: hashedGustavo
    },
    create: {
      name: 'Gustavo',
      email: 'gustavo@blackdev.com',
      passwordHash: hashedGustavo,
      roleId: adminRole.id,
    },
  })

  // Edmundo
  const edmundo = await prisma.user.upsert({
    where: { email: 'edmundo@blackdev.com' },
    update: { 
      name: 'Edmundo',
      passwordHash: hashedEdmundo
    },
    create: {
      name: 'Edmundo',
      email: 'edmundo@blackdev.com',
      passwordHash: hashedEdmundo,
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
