const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding complete operational database...')

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
  const blackdev = await prisma.user.upsert({
    where: { email: 'admin@blackdev.com' },
    update: { passwordHash: hashedAdmin },
    create: {
      name: 'BlackDev OS (SuperAdmin)',
      email: 'admin@blackdev.com',
      passwordHash: hashedAdmin,
      roleId: adminRole.id,
    },
  })

  const gustavo = await prisma.user.upsert({
    where: { email: 'gustavo@blackdev.com' },
    update: { name: 'Gustavo', passwordHash: hashedGustavo },
    create: {
      name: 'Gustavo',
      email: 'gustavo@blackdev.com',
      passwordHash: hashedGustavo,
      roleId: adminRole.id,
    },
  })

  const edmundo = await prisma.user.upsert({
    where: { email: 'edmundo@blackdev.com' },
    update: { name: 'Edmundo', passwordHash: hashedEdmundo },
    create: {
      name: 'Edmundo',
      email: 'edmundo@blackdev.com',
      passwordHash: hashedEdmundo,
      roleId: adminRole.id,
    },
  })

  // ==========================================
  // 5. CLIENTS & CONTACTS
  // ==========================================
  const techCorp = await prisma.client.create({
    data: {
      tradeName: 'TechCorp S/A',
      legalName: 'TechCorp Soluções Tecnológicas LTDA',
      document: '12.345.678/0001-99',
      status: 'ACTIVE',
      tier: 'VIP',
      contacts: {
        create: [
          { name: 'Roberto Silva', role: 'CEO', email: 'roberto@techcorp.com.br', phone: '+55 11 99999-9999', isMain: true },
          { name: 'Ana Costa', role: 'CTO', email: 'ana@techcorp.com.br', phone: '+55 11 88888-8888', isMain: false }
        ]
      }
    }
  })

  const google = await prisma.client.create({
    data: {
      tradeName: 'Google Inc.',
      legalName: 'Google Brasil Internet LTDA',
      document: '06.990.590/0001-04',
      status: 'ACTIVE',
      tier: 'ENTERPRISE',
      contacts: {
        create: [
          { name: 'Larry Page', role: 'Diretor de Operações', email: 'larry@google.com', phone: '+55 11 3737-0000', isMain: true }
        ]
      }
    }
  })

  const vanguard = await prisma.client.create({
    data: {
      tradeName: 'Vanguard Retail',
      legalName: 'Vanguard Varejo e Comércio S/A',
      document: '98.765.432/0001-11',
      status: 'ACTIVE',
      tier: 'STANDARD',
      contacts: {
        create: [
          { name: 'Lucas Marques', role: 'Gerente de TI', email: 'lucas@vanguard.com.br', phone: '+55 11 77777-7777', isMain: true }
        ]
      }
    }
  })

  // ==========================================
  // 6. PROJECTS & TASKS
  // ==========================================
  const project1 = await prisma.project.create({
    data: {
      clientId: techCorp.id,
      name: 'Landing Page Q3',
      status: 'REVIEW',
      progress: 95,
      priority: 'HIGH',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-30'),
      tasks: {
        create: [
          { title: 'Definição de Design e Layout', status: 'DONE', priority: 'HIGH' },
          { title: 'Integração de APIs de Lead', status: 'DONE', priority: 'MEDIUM' },
          { title: 'Revisão final com o cliente', status: 'REVIEW', priority: 'HIGH' }
        ]
      }
    }
  })

  const project2 = await prisma.project.create({
    data: {
      clientId: techCorp.id,
      name: 'E-commerce App',
      status: 'PLANNING',
      progress: 10,
      priority: 'MEDIUM',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-08-10'),
      tasks: {
        create: [
          { title: 'Modelagem do banco de dados', status: 'IN_PROGRESS', priority: 'HIGH' },
          { title: 'Estruturação do fluxo de checkout', status: 'TODO', priority: 'HIGH' }
        ]
      }
    }
  })

  const project3 = await prisma.project.create({
    data: {
      clientId: google.id,
      name: 'Consultoria SEO Google',
      status: 'EXECUTION',
      progress: 50,
      priority: 'HIGH',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-07-01'),
      tasks: {
        create: [
          { title: 'Auditoria técnica de SEO', status: 'DONE', priority: 'HIGH' },
          { title: 'Mapeamento de palavras-chave', status: 'IN_PROGRESS', priority: 'MEDIUM' }
        ]
      }
    }
  })

  // ==========================================
  // 7. CONTRACTS
  // ==========================================
  await prisma.contract.create({
    data: {
      clientId: techCorp.id,
      projectId: project1.id,
      title: 'Desenvolvimento Web 2026',
      value: 55000,
      status: 'SIGNED',
      signedAt: new Date('2026-01-10'),
      startsAt: new Date('2026-01-10'),
      endsAt: new Date('2026-12-31')
    }
  })

  await prisma.contract.create({
    data: {
      clientId: google.id,
      projectId: project3.id,
      title: 'Contrato SEO Avançado Google',
      value: 30000,
      status: 'SIGNED',
      signedAt: new Date('2026-05-01'),
      startsAt: new Date('2026-05-01'),
      endsAt: new Date('2026-10-31')
    }
  })

  // ==========================================
  // 8. INVOICES (Revenues)
  // ==========================================
  // Paid Invoices (Revenue this month)
  await prisma.invoice.create({
    data: {
      clientId: techCorp.id,
      projectId: project1.id,
      description: 'Sprint 1 - LP TechCorp',
      amount: 15000,
      status: 'PAID',
      dueDate: new Date('2026-05-10'),
      paidAt: new Date('2026-05-08')
    }
  })

  // Open/Pending Invoices (A Receber)
  await prisma.invoice.create({
    data: {
      clientId: techCorp.id,
      projectId: project2.id,
      description: 'Sprint 2 - LP TechCorp',
      amount: 15000,
      status: 'PENDING',
      dueDate: new Date('2026-05-25')
    }
  })

  // Overdue Invoices (Inadimplência)
  await prisma.invoice.create({
    data: {
      clientId: vanguard.id,
      description: 'E-commerce Redesign Vanguard',
      amount: 8500,
      status: 'OVERDUE',
      dueDate: new Date('2026-05-01')
    }
  })

  // ==========================================
  // 9. EXPENSES
  // ==========================================
  await prisma.expense.create({
    data: {
      description: 'Servidores AWS',
      category: 'INFRAESTRUTURA',
      amount: 5000,
      status: 'PAID',
      dueDate: new Date('2026-05-05'),
      paidAt: new Date('2026-05-05')
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Licença Adobe Creative Suite',
      category: 'OPERACIONAL',
      amount: 1500,
      status: 'PAID',
      dueDate: new Date('2026-05-01'),
      paidAt: new Date('2026-05-01')
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Aluguel Escritório BlackDev',
      category: 'OPERACIONAL',
      amount: 8500,
      status: 'PENDING',
      dueDate: new Date('2026-05-20')
    }
  })

  // ==========================================
  // 10. LEADS (CRM)
  // ==========================================
  const leadSource = await prisma.leadSource.create({
    data: { name: 'Indicação' }
  })

  await prisma.lead.create({
    data: {
      companyName: 'Netflix E2E',
      contactName: 'Marc Randolph',
      email: 'marc@netflix.com',
      phone: '+1 408 555-0199',
      city: 'Los Gatos',
      status: 'NEGOCIACAO',
      potential: 'HIGH',
      urgency: 'HIGH',
      value: 120000,
      sourceId: leadSource.id
    }
  })

  await prisma.lead.create({
    data: {
      companyName: 'Tesla CRM Integration',
      contactName: 'Elon Musk',
      email: 'elon@tesla.com',
      phone: '+1 512 555-0100',
      city: 'Austin',
      status: 'CONTATO',
      potential: 'HIGH',
      urgency: 'MEDIUM',
      value: 90000,
      sourceId: leadSource.id
    }
  })

  // ==========================================
  // 11. PROPOSALS
  // ==========================================
  await prisma.proposal.create({
    data: {
      clientId: techCorp.id,
      title: 'SaaS Development 2026',
      status: 'ACCEPTED',
      totalValue: 55000,
      paymentTerms: '50% sinal + 50% entrega',
      validUntil: new Date('2026-06-01')
    }
  })

  await prisma.proposal.create({
    data: {
      clientId: google.id,
      title: 'SEO Consulting Proposal',
      status: 'SENT',
      totalValue: 30000,
      paymentTerms: 'Mensal recorrente',
      validUntil: new Date('2026-06-15')
    }
  })

  console.log('Seeding finished successfully!')
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
