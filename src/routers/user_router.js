import express from "express";
import auth from "../middlewares/auth.js";
import { register, login, updateUser, deleteUser } from "../controllers/user_controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", auth, updateUser);
router.delete("/delete", auth, deleteUser);

export default router;