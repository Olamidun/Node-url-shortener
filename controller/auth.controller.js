const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { validationSchema, loginSchema } = require('../utils/validation')


const registerUser = async(req, res) =>{

    // validate data 

    const { error } = validationSchema.validate(req.body)
    if (error){ 
        return res.status(400).json({error: error.details[0].message})
    } else {
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        try{
            const createdUser = await user.save()
            return res.status(201).json({
                message: 'User created successfully',
                email: createdUser.email,
                userId: createdUser._id
            })
        } catch(err){
            res.status(400).send(err)
        }
    }
    
}

const login = async(req, res) =>{
    const { error } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({error})
// } else {

// }
}

module.exports = registerUser