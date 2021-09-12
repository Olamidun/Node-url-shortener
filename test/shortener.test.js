const Shortener = require('../src/models/shortener')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
chai.should(); 


chai.use(chaiHttp)

describe("URL shorteners", () =>{

    /**
     * Test for POST route which creates a shortened url
     */
    describe('/POST url', () =>{
        it('it should post a url', (done) =>{
            const url = {
                url: "https://www.google.com",
    
            }
            chai.request(app)
            .post('/api/shortener')
            .send(url)
            .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`)
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

    /**
     * Test for GET route which gets a particular shortened URL given its identifier
     */
    describe('/GET/api/shortener/:identifier', () =>{
        it('it should get a url with the given identifier', (done) =>{
    
            chai.request(app)
            .get('/api/shortener/dul6')
            .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`)
            .end((err, res) =>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('fetched')
                res.body.should.have.property('url').which.is.a('object').and.has.property('randomCharacters').length(4);
            done();
            })
        })
    })


    /**
     * Test to ensure the GET route does not return the right response if the wrong identifier is passed
     */
    describe('/GET/api/shortener/:identifier', () =>{
        it("it should not get a url if the wrong identifier is passed in", (done) =>{
            chai.request(app)
            .get('/api/shortener/SU5D')
            .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`)
            .end((err, res) =>{
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('error')
                res.body.should.have.property('message').eql('URl with that identifier does not exist');
            done();
            })
        })
    })

    /**
    * Test for GET route which gets all the shortened url and other information for a logged in user
    */
    describe('/GET/api/shortener', () =>{
        it("it should get all urls of a user if they url(s) created", (done) =>{
            chai.request(app)
            .get('/api/shortener')
            .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`)
            .end((err, res) =>{
                console.log(err)
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('url').which.is.an('array')
                res.body.should.have.property('numberOfUrl')
            done();
            })
        })
    })
    
    /**
    * Test for GET route which returns a message telling the use they do not have any shortened url if they haven't created any
    */
    describe('/GET/api/shortener', () =>{
        it("it should return a message which will be specified below if a user does not have any url created", (done) =>{
            chai.request(app)
            .get('/api/shortener')
            .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN_ONE}`)
            .end((err, res) =>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('You do not have any URL created')
            done();
            })
        })
    })

    /**
    * Test for PUT route which is used to edit the URL that was shortened.
    */
    describe('PUT a loggedin user url', () =>{

        it("it should  update a url given its identifier if the owner's token is the one being passed as an arguement to set()", (done) =>{
            // console.log(updatedUrl)
            const url = {
                url: "https://www.losales.herokuapp.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
    
            }
            chai.request(app)
            .put('/api/shortener/bofv')
            .send(url)
            .set(
                'Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`
            )
            .end((err, res) =>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Url has been updated successfully')
                res.body.should.have.property('url')
            done()
            })
        })

        /**
        * Test for PUT route which returns an error message if the person that shortened it is not the one trying to update it.
        */
        it("it should not update a url given its identifier if the owner's token is not the one being passed as an arguement to set()", (done) =>{
            // console.log(updatedUrl)
            const url = {
                url: "https://www.losales.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
    
            }
            chai.request(app)
            .put('/api/shortener/8BIk')
            .send(url)
            .set(
                'Authorization', `Bearer ${process.env.TEST_USER_TOKEN_ONE}`
            )
            .end((err, res) =>{
                res.should.have.status(401)
                res.body.should.be.a('object')
                res.body.should.have.property('error').eql('You cannot access this url as you were not the one that shortened it')
            done()
            })
        })
    })
    
    /**
    * Test for DELETE route which is used to delete a url from the db provided the owner of that url is the one trying to delete it.
    */
    describe('DELETE a loggedin user url', () =>{
        it("it should  delete a url given its identifier if the owner's token is the one being passed as an arguement to set()", (done) =>{
            chai.request(app)
            .delete('/api/shortener/Stkm')
            .set(
                'Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`
            )
            .end((err, res) =>{
                if(err){
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Url deleted!')
            done()
    
            })
        })
    })

    /**
    * Test for DELETE route which is used to delete a url from the db provided the owner of that url is the one trying to delete it.
    */
    describe('RETURN an error', () =>{
        it("it should return an error if the url a user wants to delete is non-existent", (done) =>{
            chai.request(app)
            .delete('/api/shortener/XU4Z')
            .set(
                'Authorization', `Bearer ${process.env.TEST_USER_TOKEN_TWO}`
            )
            .end((err, res) =>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('err')
            done()
    
            })
        })
    })
    
    /**
    * Test for DELETE route which gives an error message if the person trying to delete the url is not the person that created it.
    */
    describe('DO NOT DELETE a loggedin user url', () =>{
        it("it should not delete a url given its identifier if the owner's token is not the one being passed as an arguement to set()", (done) =>{
            chai.request(app)
            .delete('/api/shortener/yuLZ')
            .set(
                'Authorization', `Bearer ${process.env.TEST_USER_TOKEN_ONE}`
            )
            .end((err, res) =>{
                if(err){
                    console.log(err)
                }
                res.should.have.status(401)
                res.body.should.be.a('object')
                res.body.should.have.property('error').eql('You cannot access this url as you were not the one that shortened it')
            done()
    
            })
        })
    })
})





