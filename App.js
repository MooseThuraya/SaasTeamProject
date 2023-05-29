"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var PostModel_1 = require("./model/PostModel");
var AccountModel_1 = require("./model/AccountModel");
var CommentModel_1 = require("./model/CommentModel");
var uuid_1 = require("uuid");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.cors = require('cors');
        this.expressApp = express();
        this.middleware();
        this.routes();
        //UniVerse Models
        this.Posts = new PostModel_1.PostModel();
        this.Accounts = new AccountModel_1.AccountModel();
        this.Comments = new CommentModel_1.CommentModel();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        // Enable CORS
        this.expressApp.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            next();
        });
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
        router.get('/account/:id', function (req, res) {
            var accountId = req.params.id;
            console.log('Query single account with id: ' + accountId);
            _this.Accounts.viewAccount(res, { id: accountId }); //  
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
        router.get('/post/:id', function (req, res) {
            var postId = req.params.id;
            console.log('Query single post with id: ' + postId);
            _this.Posts.retrievePostsDetails(res, { id: postId });
        });
        router.get('/posts/', function (req, res) {
            console.log('Query All Posts');
            _this.Posts.retrieveAllPosts(res);
        });
        router.get('/posts/:accountId', function (req, res) {
            var id = req.params.accountId;
            console.log('Query All My posts using my accountId');
            _this.Posts.retrieveAllMyPosts(res, { accountId: id });
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
            // RETRIEVE post
            _this.Posts.updatePostComment(res, commentJsonObj.postId, id);
            res.json(commentJsonObj);
        });
        router.get('/comments/:postId', function (req, res) {
            var id = req.params.postId;
            console.log('Query All Comments for this Post id');
            _this.Comments.retrieveAllComments(res, { postId: id });
        });
        this.expressApp.use('/', router);
        this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/angularDist'));
    };
    return App;
}());
exports.App = App;
