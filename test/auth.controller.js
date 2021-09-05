const User = require('../src/models/user')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const should = chai.should(); 


chai.use(chaiHttp)

describe('Authentication', function(){

    // describe('/POST api/auth/register', ()=>{
    //     it('Should create a user if the write request body is sent', function(done){
    //         chai.request(app)
    //         .post('/api/auth/register')
    //         .send({
    //             "email": "example7@gmail.com",
    //             "password": "vision2021"
    //         })
    //         .end(function(err, res){
    //             if(err){
    //                 console.log(err)
    //             }
    //             res.should.have.status(201)
    //             // res.body.should.be.a('object')
    //             // // res.body.should.have.property('message').eql('User created successfully')
    
    //             // chai.request(app)
    //             // .post('/api/auth/login')
    //             // .send({
    //             //     "email": "example@gmail.com",
    //             //     "password": "vision2021"
    //             // })
    //             done()
    //         })
    //     })
    // })
    
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
})
