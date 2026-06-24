import { Router } from "express";
import { seedFromPustakalaya, updateBookWithPustakalayaUrl } from "../controllers/pustakalayaSeedController.js";

const router = Router();

router.post("/", seedFromPustakalaya);
router.put("/book/:id", updateBookWithPustakalayaUrl);

export default router;
