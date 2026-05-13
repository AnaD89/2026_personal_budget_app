import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Mâncare" },
      { name: "Chirie" },
      { name: "Rată" },
      { name: "Transport" },
      { name: "Utilități" },
      { name: "Distracție" },
    ],
    skipDuplicates: true,
  });

  await prisma.payingAccount.createMany({
    data: [
      { name: "Cash", balance: 0 },
      { name: "Revolut", balance: 0 },
      { name: "ING", balance: 0 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed categorii și conturi finalizat");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());