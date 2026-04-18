import { Schema, model } from "mongoose";
import Comment from "./comment_model.js";

const postSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [{
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

postSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (!doc) {
        return next();
    }
    await Promise.all(doc.comments.map((commentId) => Comment.findByIdAndDelete(commentId)));
    next();
});

const Post = model("Post", postSchema);

export default Post;
