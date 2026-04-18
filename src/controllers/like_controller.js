import Post from "../models/post_model.js";
import Comment from "../models/comment_model.js";

const likePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const alreadyLiked = post.likedBy.some((id) => id.toString() === req.user._id);
        if (alreadyLiked) {
            return res.status(400).json({ error: "Already liked" });
        }
        post.likedBy.push(req.user._id);
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Like failed" });
    }
};

const unlikePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.likedBy = post.likedBy.filter((id) => id.toString() !== req.user._id);
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Unlike failed" });
    }
};

const likeComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        const alreadyLiked = comment.likedBy.some((id) => id.toString() === req.user._id);
        if (alreadyLiked) {
            return res.status(400).json({ error: "Already liked" });
        }
        comment.likedBy.push(req.user._id);
        await comment.save();
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Like failed" });
    }
};

const unlikeComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        comment.likedBy = comment.likedBy.filter((id) => id.toString() !== req.user._id);
        await comment.save();
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Unlike failed" });
    }
};

export {
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
};
