import Comment from "../models/comment_model.js";
import Post from "../models/post_model.js";

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { text, parentCommentId } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const comment = await Comment.create({ text });
        post.comments.push(comment._id);
        await post.save();
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (parent) {
                parent.replies.push(comment._id);
                await parent.save();
            }
        }
        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Create comment failed" });
    }
};

const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Update failed" });
    }
};

const readComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate("replies likedBy");
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Read failed" });
    }
};

const readAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate("replies likedBy");
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ error: "Read failed" });
    }
};

const readCommentsByPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate({
            path: "comments",
            populate: {
                path: "replies likedBy",
            },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(post.comments);
    } catch (error) {
        return res.status(500).json({ error: "Read failed" });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // 1. Remove the reference from any Post that contains it
        await Post.updateMany(
            { comments: commentId },
            { $pull: { comments: commentId } }
        );

        // 2. Remove the reference from any parent Comment replies
        await Comment.updateMany(
            { replies: commentId },
            { $pull: { replies: commentId } }
        );

        // 3. Optional: If you want to delete nested replies as well (recursive)
        if (comment.replies && comment.replies.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        // 4. Finally, delete the comment itself
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: "Comment deleted and references removed" });
    } catch (error) {
        console.error(`Error deleting comment: ${error}`);
        return res.status(500).json({ error: "Delete failed." });
    }
};

export {
    createComment,
    updateComment,
    readComment,
    readAllComments,
    readCommentsByPost,
    deleteComment,
};
