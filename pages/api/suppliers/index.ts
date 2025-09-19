import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, Supplier } from "@/models";
import { getSessionServer } from "@/utils/auth";
import mongoose from "mongoose";
import allowCors from "@/utils/cors";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();

    const session = await getSessionServer(req, res);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { method } = req;
    const userId = session.id;

    switch (method) {
      case "POST":
        try {
          const { name, email, phone } = req.body;

          if (!name || !name.trim()) {
            return res.status(400).json({ error: "Supplier name is required" });
          }

          const supplier = new Supplier({
            name: name.trim(),
            email: email?.trim(),
            phone: phone?.trim(),
            userId: new mongoose.Types.ObjectId(userId),
          });

          const savedSupplier = await supplier.save();

          res.status(201).json({
            id: savedSupplier._id.toString(),
            name: savedSupplier.name,
            email: savedSupplier.email,
            phone: savedSupplier.phone,
            userId: savedSupplier.userId.toString(),
            createdAt: savedSupplier.createdAt.toISOString(),
          });
        } catch (error) {
          console.error("Error creating supplier:", error);
          res.status(500).json({ error: "Failed to create supplier" });
        }
        break;

      case "GET":
        try {
          const suppliers = await Supplier.find({
            userId: new mongoose.Types.ObjectId(userId)
          }).sort({ createdAt: -1 });

          const transformedSuppliers = suppliers.map((supplier) => ({
            id: supplier._id.toString(),
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            userId: supplier.userId.toString(),
            createdAt: supplier.createdAt.toISOString(),
          }));

          res.status(200).json(transformedSuppliers);
        } catch (error) {
          console.error("Error fetching suppliers:", error);
          res.status(500).json({ error: "Failed to fetch suppliers" });
        }
        break;

      case "PUT":
        try {
          const { id, name, email, phone } = req.body;

          if (!id || !name || !name.trim()) {
            return res.status(400).json({ error: "ID and name are required" });
          }

          const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            {
              name: name.trim(),
              email: email?.trim(),
              phone: phone?.trim(),
            },
            { new: true, runValidators: true }
          );

          if (!updatedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
          }

          res.status(200).json({
            id: updatedSupplier._id.toString(),
            name: updatedSupplier.name,
            email: updatedSupplier.email,
            phone: updatedSupplier.phone,
            userId: updatedSupplier.userId.toString(),
            createdAt: updatedSupplier.createdAt.toISOString(),
          });
        } catch (error) {
          console.error("Error updating supplier:", error);
          res.status(500).json({ error: "Failed to update supplier" });
        }
        break;

      case "DELETE":
        try {
          const { id } = req.body;

          if (!id) {
            return res.status(400).json({ error: "Supplier ID is required" });
          }

          const supplier = await Supplier.findById(id);
          if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
          }

          await Supplier.findByIdAndDelete(id);
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
  } catch (error) {
    console.error("Top-level API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  runtime: 'nodejs',

};

export default allowCors(handler);
