import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Debug: log generated models available on the Prisma client (internal _dmmf)
try {
  // _dmmf holds model info for generated client
  // Print model names if available to help debug missing model methods
  // (This is safe for debugging; remove in production)
  // eslint-disable-next-line no-console
  console.log(
    "Prisma client models:",
    prisma._dmmf?.modelMap
      ? Object.keys(prisma._dmmf.modelMap)
      : prisma._dmmf?.models?.map((m) => m.name)
  );
  // eslint-disable-next-line no-console
  console.log("Prisma has 'user' model?", !!prisma.user);
} catch (err) {
  console.error("Error logging prisma _dmmf:", err);
}

export default prisma;
