const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Testing "ping" API', function () {
    describe('/GET', function () {
        it('should return 200 status', function (done) {
            chai.request(app)
                .get('/api/ping')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    done();
                })
        });

        it('should return {success:true}', function (done) {
            chai.request(app)
                .get('/api/ping')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    res.should.be.json;
                    res.body.success.should.be.true;
                    done();
                })
        });
    });
});