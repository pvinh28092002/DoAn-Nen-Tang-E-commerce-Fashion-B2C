import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  await prisma.category.createMany({
    data: [
      {
        name: "Men",
        slug: "men",
        description: "Men's clothing",
      },
      {
        name: "Women",
        slug: "women",
        description: "Women's clothing",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Fashion accessories",
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
