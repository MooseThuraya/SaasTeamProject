//Get (Get List of Posts)
const chai = require('chai');
const chaiHttp = require('chai-http');
const async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test posts result', function () {
	this.timeout(15000);

	var requestResult;
	var response;
		 
    before(function (done) {

        chai.request("http://localhost:8080")
			.get("/posts/")
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                console.log(res.request.url);
				done();
			});
	});
    
    it('Should return an array of objects with four posts', function (){
        expect(response).to.have.status(200);
        // expect(response.body).to.be.json; doesnt work
		expect(response.headers['content-type']).to.have.string('application/json; charset=utf-8');
		expect(response.body).to.have.length.above(4);
        expect(response).to.have.headers;
    });
	it('The elements in the array have the expected properties', function(){
		expect(response.body).to.satisfy(
			function (body) {
				for (var i = 0; i < body.length; i++) {
					expect(body[i]).to.have.property('_id');
                    expect(body[i]).to.have.property('id').that.is.a('string');
                    expect(body[i]).to.have.property('accountId').that.is.a('string');
                    expect(body[i]).to.have.property('title').that.is.a('string');
					expect(body[i]).to.have.property('author').that.is.a('string');
                    expect(body[i]).to.have.property('isAnonymous');
					expect(body[i]).to.have.property('isEdited');
                    expect(body[i]).to.have.property('description').that.is.a('string');
                    expect(body[i]).to.have.property('dateTime');
                    expect(body[i]).to.have.property('likes');
                    expect(body[i]).to.have.property('dislikes');
                    expect(body[i]).to.have.property('comments');
				}
				return true;
			});
	});	
	
});