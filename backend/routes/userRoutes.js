import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);

router.get("/test", (req, res) => {
  res.json({ message: "Backend Connected Successfully" });
});


export default router;
