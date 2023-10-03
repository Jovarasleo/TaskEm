import express from "express";

import { setContainer } from "../controllers/container.controller";

const router = express.Router();

router.post("/", setContainer);

export default router;
