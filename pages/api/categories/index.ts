import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, Category } from "@/models";
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
          const { name } = req.body;

          if (!name || !name.trim()) {
            return res.status(400).json({ error: "Category name is required" });
          }

          const category = new Category({
            name: name.trim(),
            userId: new mongoose.Types.ObjectId(userId),
          });

          const savedCategory = await category.save();

          res.status(201).json({
            id: savedCategory._id.toString(),
            name: savedCategory.name,
            userId: savedCategory.userId.toString(),
            createdAt: savedCategory.createdAt.toISOString(),
          });
        } catch (error) {
          console.error("Error creating category:", error);
          res.status(500).json({ error: "Failed to create category" });
        }
        break;

      case "GET":
        try {
          const categories = await Category.find({
            userId: new mongoose.Types.ObjectId(userId)
          }).sort({ createdAt: -1 });

          const transformedCategories = categories.map((category) => ({
            id: category._id.toString(),
            name: category.name,
            userId: category.userId.toString(),
            createdAt: category.createdAt.toISOString(),
          }));

          res.status(200).json(transformedCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
          res.status(500).json({ error: "Failed to fetch categories" });
        }
        break;

      case "PUT":
        try {
          const { id, name } = req.body;

          if (!id || !name || !name.trim()) {
            return res.status(400).json({ error: "ID and name are required" });
          }

          const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true, runValidators: true }
          );

          if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
          }

          res.status(200).json({
            id: updatedCategory._id.toString(),
            name: updatedCategory.name,
            userId: updatedCategory.userId.toString(),
            createdAt: updatedCategory.createdAt.toISOString(),
          });
        } catch (error) {
          console.error("Error updating category:", error);
          res.status(500).json({ error: "Failed to update category" });
        }
        break;

      case "DELETE":
        try {
          const { id } = req.body;

          if (!id) {
            return res.status(400).json({ error: "Category ID is required" });
          }

          const category = await Category.findById(id);
          if (!category) {
            return res.status(404).json({ error: "Category not found" });
          }

          await Category.findByIdAndDelete(id);
          res.status(204).end();
        } catch (error) {
          console.error("Error deleting category:", error);
          res.status(500).json({ error: "Failed to delete category" });
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

export default allowCors(handler);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  runtime: 'nodejs',
};
