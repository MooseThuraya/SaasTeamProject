//TTD Test for HTTP POST
const chai = require('chai');
const chaiHttp = require('chai-http');
const async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test forumposts CRUD operations', function () {
	this.timeout(15000);
  
	var createdPostId = "";
	var createdPostData = {
	  id: "123", 
	  accountId: "12345",
	  title: "Test Post",
	  author: "John Doe",
	  isAnonymous: false,
	  isEdited: false,
	  description: "This is a test post.",
	  dateTime: "2023-06-05T12:00:00Z",
	  likes: 0,
	  dislikes: 0,
	  comments: []
	};
  
	// Test creating a new post
	it('Should create a new post', function (done) {
	  chai.request("http://localhost:8080")
		.post("/forumposts/")
		.send(createdPostData)
		.end(function (err, res) {
		  expect(err).to.be.null;
		  expect(res).to.have.status(200);
		  expect(res.body).to.have.property('id').that.is.a('string');
		  createdPostId = res.body.id;
		  console.log("Look: " + createdPostId);
		  done();
		});
	});

	// Test getting the created post
	it('Should get the created post', function (done) {
		chai.request("http://localhost:8080")
			.get("/forumpost/" + createdPostId)
			.end(function (err, res) {
				expect(err).to.be.null;
				expect(res.body).to.have.property('_id').that.is.a('string');
				expect(res.body).to.have.property('id').that.is.a('string');
				expect(res.body).to.have.property('accountId').that.is.a('string');
				expect(res.body).to.have.property('title').that.is.a('string');
				expect(res.body).to.have.property('author').that.is.a('string');
				expect(res.body).to.have.property('isAnonymous').that.is.a('boolean');
				expect(res.body).to.have.property('isEdited').that.is.a('boolean');
				expect(res.body).to.have.property('description').that.is.a('string');
				expect(res.body).to.have.property('dateTime').that.is.a('string');
				expect(res.body).to.have.property('likes').that.is.a('number');
				expect(res.body).to.have.property('dislikes').that.is.a('number');
				expect(res.body).to.have.property('comments').that.is.an('array');
				done();
			});
	});

	// Test deleting the created post
	it('Should delete the created post', function (done) {
		chai.request("http://localhost:8080")
			.delete("/forumpost/" + createdPostId)
			.end(function (err, res) {
				expect(err).to.be.null;
				done();
			});
	});
});
