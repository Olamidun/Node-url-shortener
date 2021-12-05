const express = require('express');
// const validationSchema = require('../utils/validation')
const {
  registerUserController, loginController, requestResetPasswordController, resetPasswordController,
} = require('../controller/auth.controller');

const authRouter = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Creates a user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Error
 */
authRouter.post('/register', registerUserController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log into an account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Error
 */

authRouter.post('/login', loginController);

/**
 * @swagger
 * /api/auth/requestPasswordReset:
 *   post:
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email containing password reset instructions has been sent
 *       400:
 *         description: Error
 */
authRouter.post('/requestPasswordReset', requestResetPasswordController);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - token
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Your password has been reset successfully
 *       400:
 *         description: Error
 */
authRouter.post('/resetPassword', resetPasswordController);

module.exports = authRouter;
