import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Test database connection
prisma
  .$connect()
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Database connection error:", error));

export { prisma };
