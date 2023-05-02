import Mongoose = require("mongoose");
import {DataAccess} from './../DataAccess';
import { ICommentModel } from "../interfaces/ICommentModel";
import { PostModel } from "./PostModel";

let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class CommentModel {
    public schema:any;
    public model:any;


    public constructor() {
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema(
            {
                id: String,
                postId: String,
                author: String,
                description: String,
                commentDate: Date,
                likes: Number,
                dislikes: Number
            }, {collection: 'comments'}
        );
    }

    public createModel(): void {
        this.model = mongooseConnection.model<ICommentModel>("Comments", this.schema);
    }


    async addComment(response: any, commentData: Object): Promise<any>{
        var commentMod = new this.model(commentData);
        return commentMod.save((err, comment) => {
            if(err){
                console.log("Error saving comment");
            } else {
                console.log("Commented successfully added");
                response.json(comment);
            }
        });
    }

    // TODO: Get Post specific comments
    public retrieveAllComments(response: any, filter:Object): any{
        console.log("id:" + filter)
        var query = this.model.find(filter);
        query.exec( (err, itemArray) => {
            response.json(itemArray) ;
        });
    }
    
}
export {CommentModel};