"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var ForumPostModel_1 = require("./model/ForumPostModel");
var AccountModel_1 = require("./model/AccountModel");
var CommentModel_1 = require("./model/CommentModel");
var uuid_1 = require("uuid");
var GooglePassport_1 = require("./GooglePassport");
var passport = require("passport");
var logger = require("morgan");
var session = require("express-session");
var cookieParser = require("cookie-parser");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.cors = require('cors');
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.googlePassportObj = new GooglePassport_1.default();
        this.idGenerator = 102;
        //UniVerse Models
        this.ForumPosts = ForumPostModel_1.ForumPostModel.getInstance();
        this.Accounts = new AccountModel_1.AccountModel();
        this.Comments = new CommentModel_1.CommentModel();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
        this.expressApp.use(logger('dev'));
        // Enable CORS
        this.expressApp.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            next();
        });
    };
    App.prototype.validateAuth = function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log("user is authenticated");
            //  session.userOpenId = sha512.sha512(req.user.id);
            //  session.userName = req.user.displayName;
            //  session.email = req.user.emails[0].value;
            // console.log("sha 512 code is "+sha512.sha512(req.user.id));
            return next(); // pass the control to the next middleware or route handler in the chain.
        }
        console.log("user is not authenticated");
        res.json({ "authentication": "failed" });
        // res.redirect('/#/');
    };
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
        // router.get('/auth/google/callback', 
        // passport.authenticate('google', 
        //   { failureRedirect: '/failure' , successRedirect: '/#/postindex'}
        // ),
        // (req, res) => {
        //   console.log("successfully authenticated user and returned to callback page.");
        //   console.log("redirecting to /postindex");
        //   res.redirect('/postindex');
        // } 
        router.get('/auth/google/callback', passport.authenticate('google', 
        // { failureRedirect: '/#/', successRedirect: '/#/'}
        { failureRedirect: '/' }), function (req, res) {
            console.log("successfully authenticated user and returned to callback page.");
            var account = {
                id: req['user'].id,
                username: req['user'].displayName,
                image: req['user'].photos[0].value
            };
            // session.account = account;
            // res.cookie('account', JSON.stringify(account), { httpOnly: true });
            // res.cookie('account', 'MOOSE', { httpOnly: true });
            res.redirect('/#/');
        });
        // Configure API endpoints.
        // private routes(): void {
        //   let router = express.Router();
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
            _this.Accounts.viewAccount(res, { id: accountId });
        });
        router.get('/studentaccountid/', this.validateAuth, function (req, res) {
            var oAuthId = req['user'].id;
            var username = req['user'].displayName;
            var imageUrl = req['user'].photos[0].value;
            console.log("HEEEY!!!!");
            console.log("oAuthId: " + oAuthId);
            console.log('Query account id via OAuthId: ' + oAuthId);
            _this.Accounts.viewProfile(res, oAuthId, username, imageUrl);
        });
        // using the account like api testing some stuff out
        // router.get('/account/', this.validateAuth, (req, res) => {
        //   console.log("getting user info");
        //   let auserName = req['user'].displayName;
        //   console.log("display name "+ auserName + " " + auserID + "\n " + req['user']);
        //   // res.send({
        //   //   userId : req.user.userId,
        //   //   userName : session.userName,
        //   //   userEmail : session.email
        //   // });
        // })
        // when want to get account data
        router.get('/getCurrentAccount', this.validateAuth, function (req, res) {
            console.log("sending user info to create post");
            // res.send({
            //   userId : req['user'].id,
            //   userName : req['user'].displayName,
            //   userEmail : req['user'].photos[0].value
            // });
            //   var userJsonObj = {
            //     id: ,
            //     username: {type: String, required: true},
            //     fname: {type: String, required: true},
            //     lname: {type: String, required: true},
            //     email: {type: String, required: true},
            //     oAuthId: req['user'].id,
            //     department: {type: String, required: true}
            //     "userId" : userId,
            //     "userName" : jsonObj.userName,
            //     "userPassword" : jsonObj.userPassword,
            //     "accountId" : accountId,
            //     "tailers" : [],
            //     "tailee" : [],
            //     "about" : jsonObj.about,
            //     "achievement" : [],
            //     "posts" : [],
            //     "openToWork" : jsonObj.openToWork,
            //     "verified" : jsonObj.verified,
            //     "verificationBadgeId" : jsonObj.verificationBadgeId,
            //     "email" : jsonObj.email,
            //     "profilePic" : jsonObj.profilePic
            // }
        });
        // POST
        router.post('/forumposts/', function (req, res) {
            // GUIDs (Globally Unique Identifiers)
            var id = (0, uuid_1.v4)();
            console.log(req.body);
            var postJsonObj = req.body;
            postJsonObj.id = id;
            _this.ForumPosts.model.create([postJsonObj], function (err) {
                if (err) {
                    console.log('forumPosts creation failed');
                }
            });
            var response = { id: id };
            res.send(response);
            // res.send('{"id":"' + id + '"}');
        });
        // router.post('/forumpostsTest/:id', (req, res) => {
        //   // GUIDs (Globally Unique Identifiers)
        //   const id = req.params.id;
        //   console.log(req.body);
        //     var postJsonObj  = req.body;
        //     postJsonObj.id = id;
        //     this.ForumPosts.model.create([postJsonObj], (err) => {
        //       if (err) {
        //           console.log('forumPosts creation failed');
        //       }
        //   });
        //     res.send('{"id":"' + id + '"}');
        // });
        router.get('/forumpost/:id', function (req, res) {
            var forumpostId = req.params.id;
            console.log('Query single forumpost with id: ' + forumpostId);
            _this.ForumPosts.retrieveForumPostsDetails(res, { id: forumpostId });
        });
        router.get('/forumposts/', function (req, res) {
            console.log('Query All ForumPosts');
            _this.ForumPosts.retrieveAllForumPosts(res);
        });
        router.delete('forumpost/:id', function (req, res) {
            console.log('Delete forumpost with id: ' + req.params.id);
            _this.ForumPosts.deleteForumPost(res, { id: req.params.id });
        });
        // TODO: 
        router.get('/forumposts/:accountId', this.validateAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var accountId, oAuthID;
            return __generator(this, function (_a) {
                console.log("Want some info, huh?!");
                accountId = req.params.accountId;
                if (req['user'] != null) {
                    oAuthID = req['user'].id;
                    this.Accounts.validateAccount(res, accountId, oAuthID);
                }
                return [2 /*return*/];
            });
        }); });
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
            // RETRIEVE forumpost
            _this.ForumPosts.updateForumPostComment(res, commentJsonObj.forumpostId, id);
            res.json(commentJsonObj);
        });
        router.get('/comments/:forumpostId', function (req, res) {
            var id = req.params.forumpostId;
            console.log('Query All Comments for this forumPost id');
            _this.Comments.retrieveAllComments(res, { forumpostId: id });
        });
        this.expressApp.use('/', router);
        this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/angularDist'));
        this.expressApp.use('/*', function (req, res) {
            res.sendFile(__dirname + '/angularDist/index.html');
        });
    };
    return App;
}());
exports.App = App;
