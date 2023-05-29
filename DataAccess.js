"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccess = void 0;
var Mongoose = require("mongoose");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var DataAccess = /** @class */ (function () {
    function DataAccess() {
        DataAccess.connect();
    }
    DataAccess.connect = function () {
        if (this.mongooseInstance)
            return this.mongooseInstance;
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.on("open", function () {
            console.log("Connected to mongodb.");
        });
        console.log("String: " + this.DB_CONNECTION_STRING);
        this.mongooseInstance = Mongoose.connect(this.DB_CONNECTION_STRING, this.OPTION);
        return this.mongooseInstance;
    };
    DataAccess.DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
    // Added this line to make the unified topology true per error
    DataAccess.OPTION = { useUnifiedTopology: true };
    return DataAccess;
}());
exports.DataAccess = DataAccess;
DataAccess.connect();
