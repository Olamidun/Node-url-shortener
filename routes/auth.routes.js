const express = require('express')
const User = require('../models/user')

const authRouter = express.Router()

authRouter.post('/register', async(req, res) =>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })
    try{
        const createdUser = await user.save()
        return res.status(201).json({
            createdUser
        })
    } catch(err){
        res.status(400).send(err)
    }
    
})

authRouter.post('/login', (req, res) =>{
    res.send('Logged in')
})

module.exports = authRouter