const Shortener = require('../src/models/shortener')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
let should = chai.should(); 


chai.use(chaiHttp)

// For testing single url endpoint
describe('/GET/api/shortener/:identifier', () =>{
    it('it should get a url with the given identifier', (done) =>{
        // let url = new Shortener({
        //     url: "https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
        //     randomCharacters: "xuty",
        //     owner: "6108947f9eedc1061cd818ff"
        // })
        
        chai.request(app)
        .get('/api/shortener/czMZ')
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
    it('it should not get a url with the given identifier', (done) =>{
        let url = new Shortener({
            url: "https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
            randomCharacters: "xyzr",
            owner: "6108947f9eedc1061cd818ff"
        })
        url.save((err, url) =>{
            console.log('/api/shortener/'+ url.randomCharacters)
            chai.request(app)
            .get('/ai/shortener/'+ url.randomCharacters)
            .send(url)
            .end((err, res) =>{
                res.should.have.status(404);
            done();
            })

        })
    })
})


describe('/POST url', () =>{
    it('it should not post a book without a owner, url and randomCharacters', (done) =>{
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


// describe('GET a loggedin user url', () =>{
//     it('it should update a url given its identifier, only the user that created the url is able to edit it.', (done) =>{
//         let updatedUrl = new Shortener({
//             url: "https://www.losales.herokuapp.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
//             randomCharacters: "xyzr",
//             owner: "6103344273d2b650c8089b42"
//         })
//         updatedUrl.save(function(err, updatedUrl){
//             chai.request(app)
//             console.log('/api/shortener/'+ updatedUrl.randomCharacters)
//             .patch('/api/shortener/'+ updatedUrl.randomCharacters)
//             .send({updatedUrl})
//             .end((err, res) =>{
//                 console.log(res)
                
//                 res.should.have.status(401)
//                 res.body.should.be.a('object')
//                 res.body.should.have.property('error').eql('You cannot access this url as you were not the one that shortened it')
//             done()

//             })
//         })
//     })
// })