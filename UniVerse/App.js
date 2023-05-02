"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var PostModel_1 = require("./model/PostModel");
var AccountModel_1 = require("./model/AccountModel");
var CommentModel_1 = require("./model/CommentModel");
var ListModel_1 = require("./model/ListModel");
var TaskModel_1 = require("./model/TaskModel");
var crypto = require("crypto");
var uuid_1 = require("uuid");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.expressApp = express();
        this.middleware();
        this.routes();
        //UniVerse Models
        this.Posts = new PostModel_1.PostModel();
        this.Accounts = new AccountModel_1.AccountModel();
        this.Comments = new CommentModel_1.CommentModel();
        //toDoSample Models
        this.Lists = new ListModel_1.ListModel();
        this.Tasks = new TaskModel_1.TaskModel();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        // ACCOUNT
        router.post('/accounts/', function (req, res) {
            var id = (0, uuid_1.v4)();
            console.log(req.body);
            var accountJsonObj = req.body;
            accountJsonObj.id = id;
            _this.Accounts.model.create([accountJsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"id":"' + id + '"}');
        });
        // POST
        router.post('/posts/', function (req, res) {
            // GUIDs (Globally Unique Identifiers)
            var id = (0, uuid_1.v4)();
            console.log(req.body);
            var postJsonObj = req.body;
            postJsonObj.id = id;
            _this.Posts.model.create([postJsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"id":"' + id + '"}');
        });
        router.get('/posts/', function (req, res) {
            console.log('Query All Posts');
            _this.Posts.retrieveAllPosts(res);
        });
        router.get('/posts/:postId', function (req, res) {
            var id = req.params.postId;
            console.log('Query single post with id: ' + id);
            _this.Posts.retrievePostsDetails(res, { postId: id });
        });
        // COMMENTS
        router.post('/comments/', function (req, res) {
            var id = (0, uuid_1.v4)();
            console.log(req.body);
            var commentJsonObj = req.body;
            commentJsonObj.id = id;
            _this.Comments.model.create([commentJsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"id":"' + id + '"}');
        });
        // Comment
        router.get('/comments/', function (req, res) {
            console.log('Query All Comments');
            _this.Comments.retrieveAllComments(res);
        });
        // toDoSample Routes
        router.post('/app/list/', function (req, res) {
            var id = crypto.randomBytes(16).toString("hex");
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.listId = id;
            _this.Lists.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send('{"id":"' + id + '"}');
        });
        router.get('/app/list/:listId/count', function (req, res) {
            var id = req.params.listId;
            console.log('Query single list with id: ' + id);
            _this.Tasks.retrieveTasksCount(res, { listId: id });
        });
        router.post('/app/list2/', function (req, res) {
            var id = crypto.randomBytes(16).toString("hex");
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.listId = id;
            var doc = new _this.Lists.model(jsonObj);
            doc.save(function (err) {
                console.log('object creation failed');
            });
            res.send('{"id":"' + id + '"}');
        });
        router.get('/app/list/:listId', function (req, res) {
            var id = req.params.listId;
            console.log('Query single list with id: ' + id);
            _this.Tasks.retrieveTasksDetails(res, { listId: id });
        });
        router.get('/app/list/', function (req, res) {
            console.log('Query All list');
            _this.Lists.retrieveAllLists(res);
        });
        router.get('/app/listcount', function (req, res) {
            console.log('Query the number of list elements in db');
            _this.Lists.retrieveListCount(res);
        });
        this.expressApp.use('/', router);
        this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/pages'));
    };
    return App;
}());
exports.App = App;
