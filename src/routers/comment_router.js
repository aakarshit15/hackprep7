import express from "express";
import auth from "../middlewares/auth.js";
import {
    createComment,
    updateComment,
    readComment,
    readAllComments,
    readCommentsByPost,
    deleteComment,
} from "../controllers/comment_controller.js";

const router = express.Router();

router.post("/create/:postId", auth, createComment);
router.put("/update/:commentId", auth, updateComment);
router.get("/read/:commentId", readComment);
router.get("/read", readAllComments);
router.get("/read/post/:postId", readCommentsByPost);
router.delete("/delete/:commentId", auth, deleteComment);

export default router;
