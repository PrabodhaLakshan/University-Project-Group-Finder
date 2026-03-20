import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcryptjs from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" 
    ? true 
    : { rejectUnauthorized: false },
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function seed() {
  console.log("🌱 Starting seed...");

  // Clear existing test users
  await prisma.users.deleteMany({
    where: {
      email: {
        in: ["test@university.edu", "student@university.edu"],
      },
    },
  });

  const hashedPassword = await bcryptjs.hash("password123", 10);

  // Create test user 1
  const user1 = await prisma.users.create({
    data: {
      student_id: "STU001",
      name: "Test Student",
      email: "test@university.edu",
      password: hashedPassword,
      skills: [],
    },
  });

  // Create test user 2
  const user2 = await prisma.users.create({
    data: {
      student_id: "STU002",
      name: "John Doe",
      email: "student@university.edu",
      password: hashedPassword,
      skills: [],
    },
  });

  console.log("✅ Seed successful!");
  console.log("\n📝 Test credentials:");
  console.log("  Email: test@university.edu");
  console.log("  Password: password123");
  console.log("\n  Email: student@university.edu");
  console.log("  Password: password123");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
