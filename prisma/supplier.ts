import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSupplier = async (data: {
  name: string;
  userId: string;
}) => {
  console.log("Creating supplier with data:", data); // Debugging log
  return prisma.supplier.create({
    data,
  });
};

export const getSuppliersByUser = async (userId: string) => {
  return prisma.supplier.findMany({
    where: { userId },
  });
};

export const updateSupplier = async (id: string, data: { name?: string }) => {
  return prisma.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id: string) => {
  return prisma.supplier.delete({
    where: { id },
  });
};
