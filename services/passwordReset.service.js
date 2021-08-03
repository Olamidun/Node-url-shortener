const User = require('../models/user')
const Token = require('../models/passwordToken')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const sendEmail = require('../utils/sendEmail')


const requestpasswordReset = async (email) =>{
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("User with this email does not exist!")
    }
    let token = await Token.findOne({ userId: user._id })
    if (token) {
        await token.deleteOne()
    }
    let resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = await bcrypt.hash(resetToken, 10)

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
    }).save()

    const link = `http://localhost:5000/passwordReset?token=${resetToken}&id=${user._id}`
    sendEmail(user.email, "Password Reset Request", {link: link})
    return {
        success: true,
        message: 'A mail containing reset instructions is on its way to you',
        link};
}

module.exports = requestpasswordReset