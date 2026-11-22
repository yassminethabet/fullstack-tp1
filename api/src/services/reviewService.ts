import { prisma } from "../lib/prisma.js";
import type { z } from "zod";
import type { reviewBody } from "../schemas/review.js";

type ReviewBody = z.infer<typeof reviewBody>;

export const listByProduct = (productId: number) =>
  prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

export const create = (productId: number, data: ReviewBody) =>
  prisma.review.create({ data: { ...data, productId } });