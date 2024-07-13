import express from "express";
import { shouldBeLoggedIn, verifyAdmin } from "../controllers/verify.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/should-be-logged-in",verifyToken,shouldBeLoggedIn)
router.post("/verify-admin",verifyAdmin)

export default router