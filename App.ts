import * as express from 'express';
import * as bodyParser from 'body-parser';
import {PostModel} from './model/PostModel';
import {AccountModel} from './model/AccountModel';
import {CommentModel} from './model/CommentModel';
import { v4 as uuidv4 } from 'uuid';


// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;
  //UniVerse Models
  public Posts:PostModel;
  public Accounts:AccountModel;
  public Comments:CommentModel;
  public cors = require('cors');

  //Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();

    //UniVerse Models
    this.Posts = new PostModel();
    this.Accounts = new AccountModel();
    this.Comments = new CommentModel();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));

  // Enable CORS
  this.expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });

  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

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
      this.Accounts.viewAccount(res, {id: accountId}); //  
    });


    // POST
    router.post('/posts/', (req, res) => {

      // GUIDs (Globally Unique Identifiers)
      const id = uuidv4();
      console.log(req.body);
        var postJsonObj  = req.body;
        postJsonObj.id = id;
        this.Posts.model.create([postJsonObj], (err) => {
          if (err) {
              console.log('object creation failed');
          }
      });
        res.send('{"id":"' + id + '"}');
    });
    
    router.get('/post/:id', (req, res) => {
      var postId = req.params.id;
      console.log('Query single post with id: ' + postId);
      this.Posts.retrievePostsDetails(res, {id: postId});
    });

    router.get('/posts/', (req, res) => {
      console.log('Query All Posts');
      this.Posts.retrieveAllPosts(res);
    });

    router.get('/posts/:accountId', (req, res) => {
      const id = req.params.accountId;
      console.log('Query All My posts using my accountId');
      this.Posts.retrieveAllMyPosts(res, {accountId: id});
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
      // RETRIEVE post
      this.Posts.updatePostComment(res, commentJsonObj.postId, id);
      res.json(commentJsonObj);
    });

    router.get('/comments/:postId', (req, res) => {
      const id = req.params.postId;
      console.log('Query All Comments for this Post id');
      this.Comments.retrieveAllComments(res, {postId: id});
    }); 

    this.expressApp.use('/', router);

    this.expressApp.use('/app/json/', express.static(__dirname+'/app/json'));
    this.expressApp.use('/images', express.static(__dirname+'/img'));
    this.expressApp.use('/', express.static(__dirname+'/angularDist'));
    
  }

}

export {App};