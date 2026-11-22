import { prisma } from "../lib/prisma.js";

export const list = () =>
  prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });