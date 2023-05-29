import Mongoose = require("mongoose");
import {DataAccess} from '../DataAccess';
import {IPostModel} from '../interfaces/IPostModel';


let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class PostModel {
    public schema:any;
    public model:any;

    public constructor() {
        this.createSchemas();
        this.createModel();
    }

    public createSchemas(): void {
        this.schema = new Mongoose.Schema(
            {
                id: {type: String, required: true},
                accountId: {type: String, required: true},
                title: {type: String, required: true},
                author: {type: String, required: true},
                isAnonymous: {type: Boolean, required: true},
                isEdited: {type: Boolean, required: true},
                description: {type: String, required: true},
                dateTime: {type: Date, required: true},
                likes: {type: Number, required: true},
                dislikes: {type: Number, required: true},
                comments: {type: [String], required: true}
            }, {collection: 'posts'}
        );
    }

    public createModel(): void{
        this.model = mongooseConnection.model<IPostModel>("Posts", this.schema);
    }

    
    async createPost(postData: Object): Promise<any>{
        const post = new this.model(postData);
        return post.save((err, post) => {
            if(err){
                console.log("Error saving post");
            } else {
                console.log("Post saved successfully");
            }
        });
    }
    
    public updatePost(response: any, filter:Object): any{
        var query = this.model.findOne(filter);
        query.exec((err, post) => {
            if(err){
                console.log("Error finding post");
            } else {
                post.title = response.title;
                post.author = response.author;
                post.isAnonymous = response.isAnonymous;
                post.likes = response.likes;
                post.dislikes = response.dislikes;
                post.comments = response.comments;
                post.save((err, post) => {
                    if(err){
                        console.log("Error saving post");
                    } else {
                        console.log("Post saved successfully");
                        response.json(post);

                    }
                });
            }
        });
    }

    public deletePost(response: any, filter:Object): any{
        var query = this.model.findOne(filter);
        query.exec((err, post) => {
            if(err){
                console.log("Error finding post");
            } else {
                post.remove((err, post) => {
                    if(err){
                        console.log("Error deleting post");
                    } else {
                        console.log("Post deleted successfully");
                    }
                });
            }
        });
    }

    public viewPost(response: any, filter:Object){
        var query = this.model.findOne(filter);
        query.exec((err, post) => {
            if(err){
                console.log("Error finding post");
            } else {
                console.log("Post found");
                response.json(post);
            }
        });
    }
    public retrieveAllMyPosts(response: any, filter:Object): any{
        console.log("id:" + filter)
        var query = this.model.find(filter);
        query.exec( (err, itemArray) => {
            response.json(itemArray) ;
        });
    }

    public retrieveAllPosts(response: any){
        var query = this.model.find({});
        query.exec( (err, postArray) => {
            if (err){
                console.log(err);
            }
            response.json(postArray) ;
        });
    }

    public updatePostComment(response: any, postId: String, commentId: string) {
        // Define the query to find the post object with the specified 'postId'
        const filter = { id: postId };
      
        // Define the update operation using the $push operator to append the 'commentId' to the 'comments' array
        const update = { $push: { comments: commentId } };
      
        // Use the findOneAndUpdate() method to perform the update operation on the post object matching the query
        this.model.findOneAndUpdate(filter, update, { new: true }, (err, post) => {
          if (err) {
            // Handle the error
            console.error(err);
            response.status(500).json({ error: 'An error occurred while updating the post' });
          } else if (!post) {
            // Handle the case where no post was found with the specified 'postId'
            response.status(404).json({ error: `No post was found with postId ${postId}` });
          } else {
            // Return the updated post object
            console.log(post)
          }
        });
      }


    public retrievePostsDetails(response:any, filter:Object) {
        var query = this.model.findOne(filter);
        query.exec( (err, postArray) => {
            response.json(postArray);
        });
    }
}
export {PostModel};