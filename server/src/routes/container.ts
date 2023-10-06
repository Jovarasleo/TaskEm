import express from "express";

import {
  getContainers,
  setContainer,
} from "../controllers/container.controller";

const router = express.Router();

router.post("/", setContainer);
router.get("/", getContainers);

export default router;
