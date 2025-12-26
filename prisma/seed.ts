// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Crear Usuario 1: El Jefe
  const jefe = await prisma.user.upsert({
    where: { email: 'jefe@crm.com' },
    update: {},
    create: {
      email: 'jefe@crm.com',
      name: 'Carlos Jefe',
    },
  })

  // Crear Usuario 2: El Vendedor
  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@crm.com' },
    update: {},
    create: {
      email: 'vendedor@crm.com',
      name: 'Ana Vendedora',
    },
  })

  console.log({ jefe, vendedor })
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