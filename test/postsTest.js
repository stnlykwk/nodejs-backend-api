const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const nock = require('nock')
const app = require('../app');
const {sample} = require('./postsSample')

chai.use(chaiHttp);
chai.should()

describe('Testing "posts" API with valid parameters', function () {
    describe('/GET', function () {
        before(function () {
            nock('http://localhost:3000')
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
                .reply(200, { sample });
        });

        it('should return 200 status', function (done) {
            chai.request(app)
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return all posts', function (done) {
            chai.request(app)
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.be.json;
                    res.body.posts.length.should.equal(sample.posts.length);
                    done();
                });
        });

        after(function () {
            nock.cleanAll();
        });
    });
});

describe('Testing "posts" API with invalid parameters', function () {
    describe('/GET posts with no tags', function () {
        it('should return 400 status', function (done) {
            chai.request(app)
                .get('/api/posts?tags=&sortBy=likes&direction=desc')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.have.status(400);
                    done();
                });
        });

        it('should return "Tags parameter is required" error message', function (done) {
            chai.request(app)
                .get('/api/posts?tags=&sortBy=likes&direction=desc')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.body.error.should.equal('Tags parameter is required');
                    done();
                });
        });
    });

    describe('/GET posts with invalid sortBy query', function () {
        it('should return 400 status', function (done) {
            chai.request(app)
                .get('/api/posts?tags=history,tech&sortBy=author&direction=desc')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.have.status(400);
                    done();
                });
        });

        it('should return "sortBy parameter is invalid: it must be one of "id, reads, likes, popularity"." error message', function (done) {
            chai.request(app)
                .get('/api/posts?tags=history,tech&sortBy=author&direction=desc')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.body.error.should.equal('sortBy parameter is invalid: it must be one of "id, reads, likes, popularity".');
                    done();
                });
        });
    });

    describe('/GET posts with invalid direction query', function () {
        it('should return 400 status', function (done) {
            chai.request(app)
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=up')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.have.status(400);
                    done();
                });
        });

        it('should return "Direction parameter is invalid: it must be "asc" or "desc"." error message', function (done) {
            chai.request(app)
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=up')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.body.error.should.equal('Direction parameter is invalid: it must be one of "asc, desc".');
                    done();
                });
        });
    });
});