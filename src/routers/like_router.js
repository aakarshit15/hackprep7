import express from "express";
import auth from "../middlewares/auth.js";
import {
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
} from "../controllers/like_controller.js";

const router = express.Router();

router.post("/post/:postId", auth, likePost);
router.delete("/post/:postId", auth, unlikePost);
router.post("/comment/:commentId", auth, likeComment);
router.delete("/comment/:commentId", auth, unlikeComment);

export default router;
