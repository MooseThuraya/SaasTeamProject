import Mongoose = require("mongoose");
import { PostModel } from "../model/PostModel";
interface ICommentModel extends Mongoose.Document {
    id: String,
    postId: String,
    author: String,
    description: String,
    dateTime: Date,
    likes: Number,
    dislikes: Number
}
export {ICommentModel};