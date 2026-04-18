import Post from "../models/post_model.js";
import Comment from "../models/comment_model.js";

const createPost = async (req, res) => {
    const { userId } = req.params;
    if (req.user._id !== userId) {
        return res.status(403).json({ error: "Forbidden" });
    }
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const post = await Post.create({ text, user: userId });
        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Create post failed" });
    }
};

const updatePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.user.toString() !== req.user._id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const updated = await Post.findByIdAndUpdate(postId, req.body, { new: true });
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ error: "Update failed" });
    }
};

const readPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("user comments likedBy");
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Read failed" });
    }
};

const readAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user comments likedBy");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: "Read failed" });
    }
};

const readUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId }).populate("user comments likedBy");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: "Read failed" });
    }
};

const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // 1. Delete all comments that belong to this post
        // Since the comments are stored in the post's 'comments' array
        if (post.comments && post.comments.length > 0) {
            await Comment.deleteMany({ _id: { $in: post.comments } });
        }

        // 2. Finally, delete the post
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({ message: "Post and its comments deleted" });
    } catch (error) {
        return res.status(500).json({ error: "Delete failed" });
    }
};

export {
    createPost,
    updatePost,
    readPost,
    readAllPosts,
    readUserPosts,
    deletePost,
};
