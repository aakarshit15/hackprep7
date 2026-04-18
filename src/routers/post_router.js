import express from "express";
import auth from "../middlewares/auth.js";
import {
    createPost,
    updatePost,
    readPost,
    readAllPosts,
    readUserPosts,
    deletePost,
} from "../controllers/post_controller.js";

const router = express.Router();

router.post("/create/:userId", auth, createPost);
router.put("/update/:postId", auth, updatePost);
router.get("/read/:postId", readPost);
router.get("/read", readAllPosts);
router.get("/read/user/:userId", readUserPosts);
router.delete("/delete/:postId", auth, deletePost);

export default router;
