const User = require('../src/models/user')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const should = chai.should(); 


chai.use(chaiHttp)

describe('Authentication', function(){


    /**
    * Test for for the route that handles registration of users.
    */
    describe('/POST api/auth/register', ()=>{
        it('Should create a user if the write request body is sent', function(done){
            chai.request(app)
            .post('/api/auth/register')
            .send({
                "email": "example7@gmail.com",
                "password": "vision2021"
            })
            .end(function(err, res){
                if(err){
                    console.log(err)
                }
                res.should.have.status(201)
                // res.body.should.be.a('object')
                // // res.body.should.have.property('message').eql('User created successfully')
    
                
                done()
            })
        })
    })
    

    /**
    * Test for for the route that handles user login.
    */
    describe('POST/ api/auth/login', ()=>{
        it('Should login a user and return auth token and a message', (done) =>{
            chai.request(app)
            .post('/api/auth/login')
            .send({
                "email": "example@gmail.com",
                "password": "vision2021"
            })
            .end(function(err, res){
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('User logged in successfully')
            })
            done()
        })
    })

    /**
    * Test for the route that handles sending of password reset email to users.
    */
    describe('POST/ api/auth/requestPasswordReset', () => {
        it('Should send password reset instruction to the email address provided', (done) =>{
            chai.request(app)
            .post('/api/auth/requestPasswordReset')
            .send({
                "email": "example@gmail.com"
            })
            .end((err, res) =>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success').eql(true)
                res.body.should.have.property('message').eql('A mail containing reset instructions is on its way to you')
            })
            done()
        })

    })
})
