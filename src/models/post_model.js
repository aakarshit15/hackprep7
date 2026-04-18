import { Schema, model } from "mongoose";


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


const Post = model("Post", postSchema);

export default Post;
