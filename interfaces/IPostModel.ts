import Mongoose = require("mongoose");

interface IPostModel extends Mongoose.Document {
    id: String,
    accountId: String,
    title: String,
    author: String,
    isAnonymous: Boolean,
    isEdited: Boolean,
    description: String,
    dateTime: Date,
    likes: Number,
    dislikes: Number,
    comments: [String]
}
export {IPostModel};