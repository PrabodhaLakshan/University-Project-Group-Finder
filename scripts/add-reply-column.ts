import { prisma } from "../src/lib/prismaClient";

async function main() {
  try {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE group_messages ADD COLUMN IF NOT EXISTS reply_to_id UUID"
    );
    console.log("✅ Column reply_to_id added successfully (or already exists).");
  } catch (e: any) {
    console.error("❌ Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
