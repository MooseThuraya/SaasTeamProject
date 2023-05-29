"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mongoose = require("mongoose");
var DataAccess_1 = require("../DataAccess");
var mongooseConnection = DataAccess_1.DataAccess.mongooseConnection;
var mongooseObj = DataAccess_1.DataAccess.mongooseInstance;
var NotifcationModel = /** @class */ (function () {
    function NotifcationModel() {
        this.createSchema();
        this.createModel();
    }
    NotifcationModel.prototype.createSchema = function () {
        this.schema = new Mongoose.Schema({
            id: { type: String, required: true },
            postId: { type: String, required: true },
            author: { type: String, required: true },
            description: { type: String, required: true },
            commentDate: { type: Date, required: true },
            likes: { type: Number, required: true },
            dislikes: { type: Number, required: true },
        }, { collection: 'notifications' });
    };
    NotifcationModel.prototype.createModel = function () {
        this.model = mongooseConnection.model("Notifcations", this.schema);
    };
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
    NotifcationModel.prototype.removeNotification = function (response, filter) {
        var query = this.model.findOne(filter);
        query.exec(function (err, notification) {
            if (err) {
                console.log("Error finding notification");
            }
            else {
                notification.remove(function (err, notification) {
                    console.log("removed");
                });
            }
        });
    };
    NotifcationModel.prototype.viewNotification = function (response, filter) {
        var query = this.model.findOne(filter);
        query.exec(function (err, notification) {
            if (err) {
                console.log("Error finding notification");
            }
            else {
                console.log("viewed ");
                response.json(notification);
            }
        });
    };
    NotifcationModel.prototype.viewAllNotifications = function (response, filter) {
        var query = this.model.find(filter);
        query.exec(function (err, notification) {
            if (err) {
                console.log("Error finding notification");
            }
            else {
                console.log("viewed ");
                response.json(notification);
            }
        });
    };
    // TODO: complete this method to have notification time
    NotifcationModel.prototype.notificationTimer = function () { };
    return NotifcationModel;
}());
