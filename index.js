import "dotenv/config";
import "./src/lib/dbConnect.js";
import express from "express";
import userRouter from "./src/routers/user_router.js";
import postRouter from "./src/routers/post_router.js";
import commentRouter from "./src/routers/comment_router.js";
import likeRouter from "./src/routers/like_router.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/user", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);

app.listen(
    PORT,
    () => {
        console.log(`Server running: http://localhost:${PORT}`);
    }
);
