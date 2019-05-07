var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

it('should throw error for missing parameter GET find', function(done) {
    chai.request(server)
      .get('/find')
      .end(function(err, res){
        res.should.have.status(400);
        res.body.should.be.a('boolean');
        res.body.should.be.false;
        done();
    });
});

it('should have a sucessful response GET find, but with no match', function(done) {
    chai.request(server)
      .get('/find')
      .query({word:'asd'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('boolean');
        res.body.should.be.false;
        done();
    });
});

it('should have a sucessful response GET find, with a match', function(done) {
    chai.request(server)
      .get('/find')
      .query({word:'stick'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
    });
});

it('should throw error for missing parameter GET compare', function(done) {
    chai.request(server)
      .get('/compare')
      .end(function(err, res){
        res.should.have.status(400);
        res.body.should.be.a('boolean');
        res.body.should.be.false;
        done();
    });
});

it('should have a sucessful response GET compare, but with no match', function(done) {
    chai.request(server)
      .get('/compare')
      .query({word1:'rwa', word2:"war"})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('boolean');
        res.body.should.be.false;
        done();
    });
});

it('should have a sucessful response GET compare, with a match', function(done) {
    chai.request(server)
      .get('/compare')
      .query({word1:'fired', word2:"fried"})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('boolean');
        res.body.should.be.true;
        done();
    });
});