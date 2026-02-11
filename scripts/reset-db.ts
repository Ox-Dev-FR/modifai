import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Supprimer tous les prompts d'abord (à cause de la relation)
  await prisma.prompt.deleteMany({})
  console.log('✓ Tous les prompts supprimés')
  
  // Supprimer tous les utilisateurs
  await prisma.user.deleteMany({})
  console.log('✓ Tous les utilisateurs supprimés')
  
  console.log('\n✅ Base de données nettoyée !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
