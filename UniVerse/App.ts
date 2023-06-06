import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ForumPostModel} from './model/ForumPostModel';
import {AccountModel} from './model/AccountModel';
import {CommentModel} from './model/CommentModel';
import { v4 as uuidv4 } from 'uuid';
import GooglePassportObj from './GooglePassport';
import * as passport from 'passport';
import * as logger from 'morgan';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;
  //UniVerse Models
  public ForumPosts:ForumPostModel;
  public Accounts:AccountModel;
  public Comments:CommentModel;
  public cors = require('cors');
  public idGenerator:number;
  public googlePassportObj:GooglePassportObj;

  //Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.googlePassportObj = new GooglePassportObj();
    this.idGenerator = 102;
    //UniVerse Models
    this.ForumPosts = ForumPostModel.getInstance();
    this.Accounts = new AccountModel();
    this.Comments = new CommentModel();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(session({ secret: 'keyboard cat', resave: true,saveUninitialized: true }));
    this.expressApp.use(cookieParser());
    this.expressApp.use(passport.initialize());
    this.expressApp.use(passport.session());
    this.expressApp.use(logger('dev'));

  // Enable CORS
  this.expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });

  }

  private validateAuth(req, res, next):void {
    if (req.isAuthenticated()) {
       console.log("user is authenticated");
      //  session.userOpenId = sha512.sha512(req.user.id);
      //  session.userName = req.user.displayName;
      //  session.email = req.user.emails[0].value;
      // console.log("sha 512 code is "+sha512.sha512(req.user.id));
        return next(); // pass the control to the next middleware or route handler in the chain.
      }
    console.log("user is not authenticated");
    res.json({"authentication" : "failed"});
    // res.redirect('/#/');
  }

  private routes(): void {
    let router = express.Router();
 
    
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
    router.get('/auth/google/callback', 
    passport.authenticate('google', 
      // { failureRedirect: '/#/', successRedirect: '/#/'}
      { failureRedirect: '/'}
    ),
    (req, res) => {
      console.log("successfully authenticated user and returned to callback page.");
      
      const account = {
        id: req['user'].id,
        username: req['user'].displayName,
        image: req['user'].photos[0].value
      }

      
      // session.account = account;

      // res.cookie('account', JSON.stringify(account), { httpOnly: true });
      // res.cookie('account', 'MOOSE', { httpOnly: true });


      res.redirect('/#/');
    }
    );

  // Configure API endpoints.
  // private routes(): void {
  //   let router = express.Router();

    // ACCOUNT
    router.post('/accounts/', (req, res) => {
      const id = uuidv4();
      console.log(req.body);
        var accountJsonObj  = req.body;
        accountJsonObj.id = id;
        this.Accounts.model.create([accountJsonObj], (err) => {
          if (err) {
              console.log('object creation failed');
          }
      });
        res.send('{"id":"' + id + '"}');
    });

    router.get('/account/:id', (req, res) => {
      var accountId = req.params.id;
      console.log('Query single account with id: ' + accountId);
      this.Accounts.viewAccount(res, {id: accountId});
    });

    router.get('/studentaccountid/', this.validateAuth,  (req, res) => {
      let oAuthId = req['user'].id;
      let username = req['user'].displayName;
      let imageUrl = req['user'].photos[0].value;

      console.log("HEEEY!!!!");
      console.log("oAuthId: "+oAuthId);
      console.log('Query account id via OAuthId: ' + oAuthId);
      this.Accounts.viewProfile(res, oAuthId, username, imageUrl);
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
    router.get('/getCurrentAccount', this.validateAuth, (req, res) => {
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
    })

    
    // POST
    router.post('/forumposts/', (req, res) => {

      // GUIDs (Globally Unique Identifiers)
      const id = uuidv4();
      console.log(req.body);
        var postJsonObj  = req.body;
        postJsonObj.id = id;
        this.ForumPosts.model.create([postJsonObj], (err) => {
          if (err) {
              console.log('forumPosts creation failed');
          }
      });
        const response = { id: id };
        res.send(response);
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
    
    router.get('/forumpost/:id', (req, res) => {
      var forumpostId = req.params.id;
      console.log('Query single forumpost with id: ' + forumpostId);
      this.ForumPosts.retrieveForumPostsDetails(res, {id: forumpostId});
    });

    router.get('/forumposts/', (req, res) => {
      console.log('Query All ForumPosts');
      this.ForumPosts.retrieveAllForumPosts(res);
    });

    router.delete('forumpost/:id', (req, res) => {
      console.log('Delete forumpost with id: ' + req.params.id);
      this.ForumPosts.deleteForumPost(res, {id: req.params.id});
    });

      
    // TODO: 
    router.get('/forumposts/:accountId', this.validateAuth, async (req, res) => {
      console.log("Want some info, huh?!");
    
      const accountId = req.params.accountId;
      if (req['user'] != null){
        // Not null
        const oAuthID = req['user'].id;
    
        this.Accounts.validateAccount(res, accountId, oAuthID);
      }
    });
    
    
    

    // COMMENTS
    router.post('/comments/', (req, res) => {
      const id = uuidv4();
      console.log(req.body);
        var commentJsonObj = req.body;
        commentJsonObj.id = id;
        this.Comments.model.create([commentJsonObj], (err) => {
          if (err) {
              console.log('object creation failed');
          }
      });
      // RETRIEVE forumpost
      this.ForumPosts.updateForumPostComment(res, commentJsonObj.forumpostId, id);
      res.json(commentJsonObj);
    });

    router.get('/comments/:forumpostId', (req, res) => {
      const id = req.params.forumpostId;
      console.log('Query All Comments for this forumPost id');
      this.Comments.retrieveAllComments(res, {forumpostId: id});
    }); 

    this.expressApp.use('/', router);
    
    this.expressApp.use('/app/json/', express.static(__dirname+'/app/json'));
    this.expressApp.use('/images', express.static(__dirname+'/img'));
    this.expressApp.use('/', express.static(__dirname+'/angularDist'));
    this.expressApp.use('/*', function(req, res){
      res.sendFile(__dirname+'/angularDist/index.html')
    })

  }

}

export {App};