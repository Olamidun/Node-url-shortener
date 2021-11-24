const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../src/models/user');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
  /**
    * Test for for the route that handles registration of users.
    */
  describe('/POST api/auth/register', () => {
    it('Should create a user if the write request body is sent', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({
          email: 'example7@gmail.com',
          password: 'vision2021',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User created successfully');
          done();
        });
    });
  });

  /**
    * Test for for the route that handles user login.
    */
  describe('POST/ api/auth/login', () => {
    it('Should login a user and return auth token and a message', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'example@gmail.com',
          password: 'vision2021',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User logged in successfully');
        });
      done();
    });
  });

  /**
    * Test for the route that handles sending of password reset email to users.
    */
  describe('POST/ api/auth/requestPasswordReset', () => {
    it('Should send password reset instruction to the email address provided', (done) => {
      chai.request(app)
        .post('/api/auth/requestPasswordReset')
        .send({
          email: 'example@gmail.com',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message').eql('If the Email address you specify exists in our system, we have sent password reset instructions to it!');
        });
      done();
    });
  });

  /** Test to check if a user entered a non-existent email address.
    */
  describe('RETURN an error if a non-existent password is entered', () => {
    it('Should not send password reset instruction to the email address provided if it does not exist in the database', (done) => {
      chai.request(app)
        .post('/api/auth/requestPasswordReset')
        .send({
          email: 'kolapoolamidun@gmail.com',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('User with this email does not exist!');
        });
      done();
    });
  });

  /** Test to check if a user entered an email address with invalid format.
    */
  describe('RETURN a 404 error if an invalid email format is provided', () => {
    it('Should return a response that says that the email is invalid', (done) => {
      chai.request(app)
        .post('/api/auth/requestPasswordReset')
        .send({
          email: 'kolapoolamidungmail.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('\"email\" must be a valid email');
        });
      done();
    });
  });

  /** Test to check if a user is entering an expired or invalid token.
    */
  describe('POST/ api/auth/resetPassword', () => {
    it('Should not change the old password to the new one the user supplied if an expired token is used', (done) => {
      chai.request(app)
        .post('/api/auth/resetPassword')
        .send({
          userId: '6108947f9eedc1061cd818ff',
          token: '06bceb79eafbf7af6d8085b13776fe044ed855a8b5bf69f7cba4d7c3921af555',
          password: '09/may/1999!',
          repeatPassword: '09/may/1999!',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Invalid or expired password reset token!');
        });
      done();
    });
  });

  /** Test to change password if a user entered the appropriate token,
   *  userId along with the new password!.
    */
  describe('POST/ api/auth/resetPassword', () => {
    it('Should not change the old password to the new one the user supplied if an expired token is used', (done) => {
      chai.request(app)
        .post('/api/auth/resetPassword')
        .send({
          userId: '6108947f9eedc1061cd818ff',
          token: '06bceb79eafbf7af6d8085b13776fe044ed855a8b5bf69f7cba4d7c3921af555',
          password: '09/may/1999!',
          repeatPassword: '09/may/1999!',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Invalid or expired password reset token!');
        });
      done();
    });
  });
});
