import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const rawConnectionString = process.env.DATABASE_URL;
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

function withDevSafeSslMode(url: string) {
  if (process.env.NODE_ENV === "production") return url;

  const hasSslMode = /(?:\?|&)sslmode=/i.test(url);
  if (hasSslMode) {
    return url.replace(/sslmode=require/gi, "sslmode=no-verify");
  }

  return `${url}${url.includes("?") ? "&" : "?"}sslmode=no-verify`;
}

const connectionString = withDevSafeSslMode(rawConnectionString);

// Supabase requires SSL. In some environments you get
// "self-signed certificate in certificate chain" -> disable cert verification.
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
