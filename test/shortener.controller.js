const Shortener = require('../src/models/shortener')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
chai.should(); 


chai.use(chaiHttp)

// For testing single url endpoint
describe('/GET/api/shortener/:identifier', () =>{
    it('it should get a url with the given identifier', (done) =>{

        //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAzMzQ4YTVmZDNlZDJiYTRlYmVhZWQiLCJpYXQiOjE2MjkxODY0MjksImV4cCI6MTYzMDA1MDQyOX0.98RgRq8b9MZUFVUOkmM4NWJDsNpw2OT4Ms6X1RYCHmI
        chai.request(app)
        .get('/api/shortener/oACh')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAzMzQ4YTVmZDNlZDJiYTRlYmVhZWQiLCJpYXQiOjE2MjkxODY0MjksImV4cCI6MTYzMDA1MDQyOX0.98RgRq8b9MZUFVUOkmM4NWJDsNpw2OT4Ms6X1RYCHmI')
        .end((err, res) =>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('fetched')
            res.body.should.have.property('url').which.is.a('object').and.has.property('randomCharacters').length(4);
        done();
        })
    })
})


describe('/GET/api/shortener/:identifier', () =>{
    it("it should not get a url if the wrong identifier is passed in", (done) =>{
        chai.request(app)
        .get('/api/shortener/SU5D')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA4OTQ3ZjllZWRjMTA2MWNkODE4ZmYiLCJpYXQiOjE2Mjk0NzE3MzAsImV4cCI6MTYzMDMzNTczMH0.qNJzqsrv0ldRv6s8ykY7f9YFc7jmO9XQBWG8KnrMzFo')
        .end((err, res) =>{
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('error')
            res.body.should.have.property('message').eql('URl with that identifier does not exist');
        done();
        })
    })
})

describe('/GET/api/shortener', () =>{
    it("it should get all urls of a user if they url(s) created", (done) =>{
        chai.request(app)
        .get('/api/shortener')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAzMzQ4YTVmZDNlZDJiYTRlYmVhZWQiLCJpYXQiOjE2MjkxODY0MjksImV4cCI6MTYzMDA1MDQyOX0.98RgRq8b9MZUFVUOkmM4NWJDsNpw2OT4Ms6X1RYCHmI')
        .end((err, res) =>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('url').which.is.an('array')
            res.body.should.have.property('numberOfUrl')
        done();
        })
    })
})

describe('/GET/api/shortener', () =>{
    it("it should return a message which will be specified below if a user does not have any url created", (done) =>{
        chai.request(app)
        .get('/api/shortener')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA4OTQ3ZjllZWRjMTA2MWNkODE4ZmYiLCJpYXQiOjE2Mjk0NzE3MzAsImV4cCI6MTYzMDMzNTczMH0.qNJzqsrv0ldRv6s8ykY7f9YFc7jmO9XQBWG8KnrMzFo')
        .end((err, res) =>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('You do not have any URL created')
        done();
        })
    })
})


describe('/POST url', () =>{
    it('it should post a url', (done) =>{
        const url = {
            url: "https://www.google.com",

        }
        chai.request(app)
        .post('/api/shortener')
        .send(url)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAzMzQ4YTVmZDNlZDJiYTRlYmVhZWQiLCJpYXQiOjE2MjkxODY0MjksImV4cCI6MTYzMDA1MDQyOX0.98RgRq8b9MZUFVUOkmM4NWJDsNpw2OT4Ms6X1RYCHmI')
        .end((err, res) =>{
            res.should.have.status(201)
            res.body.should.be.a('object')
            res.body.should.have.property('status').eql('created')
            res.body.should.have.property('createdUrl').which.is.an('object').and.has.property('url');
            res.body.should.have.property('createdUrl').which.is.an('object').and.has.property('randomCharacters');
        done()
        })
    })
})


describe('PATCH a loggedin user url', () =>{
    it("it should  update a url given its identifier if the owner's token is the one being passed as an arguement to set()", (done) =>{
        let updatedUrl = new Shortener({
            url: "https://www.losales.herokuapp.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
        })
        updatedUrl.save(function(err, updatedUrl){
            chai.request(app)
            .put('/api/shortener/oACh')
            .send(updatedUrl)
            .set(
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAzMzQ4YTVmZDNlZDJiYTRlYmVhZWQiLCJpYXQiOjE2MjkxODY0MjksImV4cCI6MTYzMDA1MDQyOX0.98RgRq8b9MZUFVUOkmM4NWJDsNpw2OT4Ms6X1RYCHmI'
            )
            .end((err, res) =>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Url has been updated successfully')
                res.body.should.have.property('url')
            done()

            })
        })
    })
})


describe('PATCH a loggedin user url', () =>{
    it("it should not update a url given its identifier if the owner's token is not the one being passed as an arguement to set()",(done) =>{
        let updatedUrl = new Shortener({
            url: "https://www.losales.herokuapp.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
        })
        updatedUrl.save(function(err, updatedUrl){
            chai.request(app)
            .put('/api/shortener/oACh')
            .send({updatedUrl})
            .set(
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA4OTQ3ZjllZWRjMTA2MWNkODE4ZmYiLCJpYXQiOjE2Mjk0NzE3MzAsImV4cCI6MTYzMDMzNTczMH0.qNJzqsrv0ldRv6s8ykY7f9YFc7jmO9XQBWG8KnrMzFo'
            )
            .end((err, res) =>{
                res.should.have.status(401)
                res.body.should.be.a('object')
                res.body.should.have.property('error').eql('You cannot access this url as you were not the one that shortened it')
            done()

            })
        })
    })
})


describe('DELETE a loggedin user url', () =>{
    it("it should  delete a url given its identifier if the owner's token is the one being passed as an arguement to set()", (done) =>{
        chai.request(app)
        .delete('/api/shortener/suuR')
        .set(
            'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAzMzQ4YTVmZDNlZDJiYTRlYmVhZWQiLCJpYXQiOjE2MjkxODY0MjksImV4cCI6MTYzMDA1MDQyOX0.98RgRq8b9MZUFVUOkmM4NWJDsNpw2OT4Ms6X1RYCHmI'
        )
        .end((err, res) =>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Url deleted!')
        done()

        })
    })
})

describe('DO NOT DELETE a loggedin user url', () =>{
    it("it should not delete a url given its identifier if the owner's token is not the one being passed as an arguement to set()", (done) =>{
        chai.request(app)
        .delete('/api/shortener/uJtf')
        .set(
            'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA4OTQ3ZjllZWRjMTA2MWNkODE4ZmYiLCJpYXQiOjE2Mjk0NzE3MzAsImV4cCI6MTYzMDMzNTczMH0.qNJzqsrv0ldRv6s8ykY7f9YFc7jmO9XQBWG8KnrMzFo'
        )
        .end((err, res) =>{
            res.should.have.status(401)
            res.body.should.be.a('object')
            res.body.should.have.property('error').eql('You cannot access this url as you were not the one that shortened it')
        done()

        })
    })
})