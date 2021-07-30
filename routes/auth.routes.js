const express = require('express')
const User = require('../models/user')
// const validationSchema = require('../utils/validation')
const { registerUser, login } = require('../controller/auth.controller')

const authRouter = express.Router()

authRouter.post('/register', registerUser)

authRouter.post('/login', login)

module.exports = authRouter