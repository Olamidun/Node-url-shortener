const express = require('express');
// const validationSchema = require('../utils/validation')
const {
  registerUserController, loginController, requestResetPasswordController, resetPasswordController,
} = require('../controller/auth.controller');

const authRouter = express.Router();

authRouter.post('/register', registerUserController);

authRouter.post('/login', loginController);

authRouter.post('/requestPasswordReset', requestResetPasswordController);
authRouter.post('/resetPassword', resetPasswordController);

module.exports = authRouter;
