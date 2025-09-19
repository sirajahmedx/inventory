import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, Product, Category, Supplier } from "@/models";
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
          const { name, sku, price, quantity, status, categoryId, supplierId } = req.body;

          if (!name || !sku || !price || !quantity || !categoryId || !supplierId) {
            return res.status(400).json({ error: "All fields are required" });
          }

          const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
          if (existingProduct) {
            return res.status(400).json({ error: "SKU must be unique" });
          }

          const product = new Product({
            name,
            sku,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            categoryId: new mongoose.Types.ObjectId(categoryId),
            supplierId: new mongoose.Types.ObjectId(supplierId),
            userId: new mongoose.Types.ObjectId(userId),
          });

          const savedProduct = await product.save();

          const populatedProduct = await Product.findById(savedProduct._id)
            .populate('categoryId', 'name')
            .populate('supplierId', 'name');

          res.status(201).json({
            id: savedProduct._id.toString(),
            name: savedProduct.name,
            sku: savedProduct.sku,
            price: savedProduct.price,
            quantity: savedProduct.quantity,
            status: savedProduct.status,
            userId: savedProduct.userId.toString(),
            categoryId: savedProduct.categoryId.toString(),
            supplierId: savedProduct.supplierId.toString(),
            createdAt: savedProduct.createdAt.toISOString(),
            category: populatedProduct?.categoryId?.name || "Unknown",
            supplier: populatedProduct?.supplierId?.name || "Unknown",
          });
        } catch (error) {
          console.error("Error creating product:", error);
          res.status(500).json({ error: "Failed to create product" });
        }
        break;

      case "GET":
        try {
          const products = await Product.find({ userId: new mongoose.Types.ObjectId(userId) })
            .populate('categoryId', 'name')
            .populate('supplierId', 'name')
            .sort({ createdAt: -1 });

          if (process.env.NODE_ENV === 'development') {
            console.log("Raw products from database:", products.length);
          }

          const transformedProducts = products.map((product) => ({
            id: product._id.toString(),
            name: product.name,
            sku: product.sku,
            price: product.price,
            quantity: product.quantity,
            status: product.status,
            userId: product.userId.toString(),
            categoryId: product.categoryId.toString(),
            supplierId: product.supplierId.toString(),
            createdAt: product.createdAt.toISOString(),
            category: product.categoryId?.name || "Unknown",
            supplier: product.supplierId?.name || "Unknown",
          }));

          res.status(200).json(transformedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).json({ error: "Failed to fetch products" });
        }
        break;

      case "PUT":
        try {
          const { id, name, sku, price, quantity, status, categoryId, supplierId } = req.body;

          if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
          }

          const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
              name,
              sku,
              price: parseFloat(price),
              quantity: parseInt(quantity),
              status,
              categoryId: new mongoose.Types.ObjectId(categoryId),
              supplierId: new mongoose.Types.ObjectId(supplierId),
            },
            { new: true, runValidators: true }
          );

          if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
          }

          const populatedProduct = await Product.findById(updatedProduct._id)
            .populate('categoryId', 'name')
            .populate('supplierId', 'name');

          res.status(200).json({
            id: updatedProduct._id.toString(),
            name: updatedProduct.name,
            sku: updatedProduct.sku,
            price: updatedProduct.price,
            quantity: updatedProduct.quantity,
            status: updatedProduct.status,
            userId: updatedProduct.userId.toString(),
            categoryId: updatedProduct.categoryId.toString(),
            supplierId: updatedProduct.supplierId.toString(),
            createdAt: updatedProduct.createdAt.toISOString(),
            category: populatedProduct?.categoryId?.name || "Unknown",
            supplier: populatedProduct?.supplierId?.name || "Unknown",
          });
        } catch (error) {
          console.error("Error updating product:", error);
          res.status(500).json({ error: "Failed to update product" });
        }
        break;

      case "DELETE":
        try {
          const { id } = req.body;

          if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
          }

          const deletedProduct = await Product.findByIdAndDelete(id);

          if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
          }

          res.status(204).end();
        } catch (error) {
          console.error("Error deleting product:", error);
          res.status(500).json({ error: "Failed to delete product" });
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
