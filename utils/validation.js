const Joi = require('joi')

const validationSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(12).required()
    // repeat_password: Joi.ref('password')
})

module.exports = validationSchema