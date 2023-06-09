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
  
        return next(); // pass the control to the next middleware or route handler in the chain.
      }
    console.log("user is not authenticated");
    res.json({"authentication" : "failed"});
    // res.redirect('/#/');
  }

  private routes(): void {
    let router = express.Router();
 
    
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

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


      res.redirect('/#/');
    }
    );


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



    // when want to get account data
    router.get('/getCurrentAccount', this.validateAuth, (req, res) => {
      console.log("sending user info to create post");

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
        res.send('{"id":"' + id + '"}');
    });

    
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