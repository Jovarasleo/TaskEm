import express from "express";

import {
  getContainers,
  setContainer,
} from "../controllers/container.controller.js";

const router = express.Router();

router.post("/", setContainer);
router.get("/", getContainers);

export default router;
