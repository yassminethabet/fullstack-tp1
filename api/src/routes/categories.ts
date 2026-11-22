import { Router } from "express";
import * as service from "../services/categoryService.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res) => {
  res.json(await service.list());
});