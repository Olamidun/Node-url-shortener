const User = require('../models/user')
const validationSchema = require('../utils/validation')


const registerUser = async(req, res) =>{

    // validate data 

    const { error } = validationSchema.validate(req.body)
    if (error){ 
        return res.status(400).json({error: error.details[0].message})
    } else {
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
    }
    
}

module.exports = registerUser