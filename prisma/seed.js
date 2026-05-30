const { PrismaClient } = require('@prisma/client')
const { categories, tools } = require('./seed-data')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.toolCategory.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.category.deleteMany()

  // Insert categories
  console.log(`📁 Creating ${categories.length} categories...`)
  for (const cat of categories) {
    await prisma.category.create({ data: cat })
  }

  // Insert tools with their category relations
  console.log(`🔧 Creating ${tools.length} tools...`)
  for (const toolData of tools) {
    const { categories: catSlugs, ...toolFields } = toolData
    
    // Find or create the tool
    const tool = await prisma.tool.create({
      data: {
        ...toolFields,
        categories: {
          create: catSlugs.map((slug) => ({
            category: {
              connect: { slug },
            },
          })),
        },
      },
    })
    console.log(`  ✅ ${tool.name}`)
  }

  console.log('')
  console.log('✅ Seeding complete!')
  console.log(`   ${categories.length} categories`)
  console.log(`   ${tools.length} tools`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
