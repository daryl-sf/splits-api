import { PrismaClient } from '@prisma/client'
import { beforeAll, beforeEach, afterAll } from 'vitest'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  // Get all tables in the public schema
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename 
    FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public';
  `
  
  // Truncate all tables in a single transaction
  await prisma.$transaction([
    // Disable foreign key checks, truncate all tables, enable foreign key checks
    prisma.$executeRawUnsafe('SET CONSTRAINTS ALL DEFERRED;'),
    ...tables.map(({ tablename }) => 
      prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`)
    ),
    prisma.$executeRawUnsafe('SET CONSTRAINTS ALL IMMEDIATE;')
  ])
})

afterAll(async () => {
  await prisma.$disconnect()
})

export { prisma }
