import { Schema, model } from "mongoose";
import Post from "./post_model.js";

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
}, {
    timestamps: true,
});

async function deleteReplies(comment) {
    await Promise.all(comment.replies.map(async (replyId) => {
        const reply = await Comment.findById(replyId);
        if (reply) {
            await Comment.findByIdAndDelete(replyId);
        }
    }));
}

commentSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (!doc) {
        return next();
    }
    await Post.updateMany({ comments: doc._id }, { $pull: { comments: doc._id } });
    await this.model.updateMany({ replies: doc._id }, { $pull: { replies: doc._id } });
    await deleteReplies(doc);
    next();
});

const Comment = model("Comment", commentSchema);

export default Comment;
