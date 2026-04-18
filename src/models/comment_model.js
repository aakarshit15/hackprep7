import { Schema, model } from "mongoose";


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


const Comment = model("Comment", commentSchema);

export default Comment;
