import Mongoose = require("mongoose");
import {DataAccess} from './../DataAccess';
import {IAccountModel} from "../interfaces/IAccountModel";
let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;


class AccountModel {
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
                username: {type: String, required: true},
                fname: {type: String, required: true},
                lname: {type: String, required: true},
                email: {type: String, required: true},
                department: {type: String, required: true}
            }, {collection: 'accounts'} // TODO: review what this line is for
        );
    }

    //  accountDocument = IaccountModel 
    // Account = Mongoose.model<IaccountModel> = this.model

    public createModel(): void {
        console.log("Inside createModel")
        this.model = mongooseConnection.model<IAccountModel>("Accounts", this.schema);
    }

    public viewAccount(response: any, filter: object) {
        console.log("id: " + filter)
        var query = this.model.findOne(filter);
        query.exec((err, userAccount) => {
            response.json(userAccount);
        });
    }
}
export {AccountModel};