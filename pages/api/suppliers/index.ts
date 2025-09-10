import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSessionServer } from "@/utils/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSessionServer(req, res);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { method } = req;
  const userId = session.id;

  switch (method) {
    case "POST":
      try {
        const { name } = req.body;
        const supplier = await prisma.supplier.create({
          data: {
            name,
            userId,
          },
        });
        res.status(201).json(supplier);
      } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ error: "Failed to create supplier" });
      }
      break;
    case "GET":
      try {
        const suppliers = await prisma.supplier.findMany({
          where: { userId },
        });
        res.status(200).json(suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
      }
      break;
    case "PUT":
      try {
        const { id, name } = req.body;

        if (!id || !name) {
          return res.status(400).json({ error: "ID and name are required" });
        }

        const updatedSupplier = await prisma.supplier.update({
          where: { id },
          data: { name },
        });

        res.status(200).json(updatedSupplier);
      } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ error: "Failed to update supplier" });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;

        const supplier = await prisma.supplier.findUnique({
          where: { id },
        });

        if (!supplier) {
          return res.status(404).json({ error: "Supplier not found" });
        }

        await prisma.supplier.delete({
          where: { id },
        });

        res.status(204).end();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ error: "Failed to delete supplier" });
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
