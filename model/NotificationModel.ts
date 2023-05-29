import Mongoose = require("mongoose");
import { DataAccess } from "../DataAccess";
import { INotificationModel } from "../interfaces/INotificationModel";

let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class NotifcationModel {
    public schema:any;
    public model:any;

    public constructor() {
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema(
            {
                id: {type: String, required: true},
                postId: {type: String, required: true},
                author: {type: String, required: true},
                description: {type: String, required: true},
                commentDate: {type: Date, required: true},
                likes: {type: Number, required: true},
                dislikes: {type: Number, required: true},

            }, {collection: 'notifications'}
        );
    }

    public createModel(): void {
        this.model = mongooseConnection.model<INotificationModel>("Notifcations", this.schema);
    }

    // async createNotification(response: any, commentData: Object): Promise<any>{
    //     var commentMod = new this.model(commentData);
    //     return commentMod.save((err, comment) => {
    //         if(err){
    //             console.log("Error saving comment");
    //         } else {
    //             console.log("Commented successfully added");
    //             response.json(comment);
    //         }
    //     });
    // }
    // public createNotification(): void{}

    public removeNotification(response: any, filter: Object): void{
        var query = this.model.findOne(filter);
        query.exec((err, notification) => {
            if (err) {
                console.log("Error finding notification");
            } else {
                notification.remove((err, notification) => {
                    console.log("removed");
                }); 
            }
        });
    }

    public viewNotification(response:any, filter:Object): any{
        var query = this.model.findOne(filter);
        query.exec((err, notification) => {
            if (err) {
                console.log("Error finding notification");
            } else {
                console.log("viewed ");
                response.json(notification);
            }
        });
    }
    public viewAllNotifications(response:any, filter:Object): any{
        var query = this.model.find(filter);
        query.exec((err, notification) => {
            if (err) {
                console.log("Error finding notification");
            } else {
                console.log("viewed ");
                response.json(notification);
            }
        });
    }

    // TODO: complete this method to have notification time
    public notificationTimer(): any{}
}