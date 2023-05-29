import Mongoose = require("mongoose");
import { config } from 'dotenv';
config();

class DataAccess {
    static mongooseInstance: any;
    static mongooseConnection: Mongoose.Connection;
    static DB_CONNECTION_STRING:string = process.env.DB_CONNECTION_STRING;
    // Added this line to make the unified topology true per error
    static OPTION = {useUnifiedTopology: true };
    
    constructor () {
        DataAccess.connect();
    }
    
    static connect (): Mongoose.Connection {
        if(this.mongooseInstance) return this.mongooseInstance;
        
        this.mongooseConnection  = Mongoose.connection;
        this.mongooseConnection.on("open", () => {
            console.log("Connected to mongodb.");
        });
        console.log("String: "+this.DB_CONNECTION_STRING);
        this.mongooseInstance = Mongoose.connect(this.DB_CONNECTION_STRING, this.OPTION);
        return this.mongooseInstance;
    }
    
}
DataAccess.connect();
export {DataAccess};