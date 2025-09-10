import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (data: {
  name: string;
  userId: string;
}) => {
  console.log("Creating category with data:", data); // Debugging log
  return prisma.category.create({
    data,
  });
};

export const getCategoriesByUser = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
  });
};

export const updateCategory = async (id: string, data: { name?: string }) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};
