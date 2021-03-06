const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Token = require('../models/passwordToken');
const sendEmail = require('../utils/sendEmail');

const requestpasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { error: 'User with this email does not exist!' };
  }
  const token = await Token.findOne({ userId: user.id });
  if (token) {
    await token.deleteOne();
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 10);

  await new Token({
    userId: user.id,
    token: hashedToken,
    createdAt: Date.now(),
  }).save();

  const link = `http://localhost:5000/passwordReset?token=${resetToken}&id=${user.id}`;
  sendEmail(user.email, 'Password Reset Request', { link });
  return {
    success: true,
    message: 'If the Email address you specify exists in our system, we have sent password reset instructions',
    link,
  };
};

const resetPassword = async (userId, token, password) => {
  const passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    return { error: 'Invalid or expired password reset token!' };
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    return { error: 'Invalid or expired password reset token!' };
  }
  const hash = await bcrypt.hash(password, 8);
  await User.updateOne({ _id: userId },
    { $set: { password: hash } },
    { new: true });

  const user = await User.findById({ _id: userId });
  sendEmail(user.email, 'Password has been reset successfully', { email: user.email, link: 'https://www.google.com' });

  await passwordResetToken.deleteOne();
  return { status: true, message: 'Your password has been changed  successfully' };
};
module.exports = { requestpasswordReset, resetPassword };
