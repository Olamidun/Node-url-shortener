const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationSchema, loginSchema, requestPasswordInstructionSchema } = require('../utils/validation');
const { generateToken } = require('../utils/token');
const { requestpasswordReset, resetPassword } = require('../services/passwordReset.service');

const registerUserController = async (req, res) => {
  // validate data
  const { error } = validationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    const createdUser = await user.save();
    return res.status(201).json({
      message: 'User created successfully',
      email: createdUser.email,
      userId: createdUser.id, // to be investigated
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

const loginController = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) res.status(400).json({ error });
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).json({ message: 'User logged in successfully', token: generateToken(user) });
    } else {
      res.status(400).json({ message: 'Invalid login details' });
    }
  } else {
    res.status(400).json({
      error: 'This user does not have an account with us.',
    });
  }
};

const requestResetPasswordController = async (req, res) => {
  const { error } = requestPasswordInstructionSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  }
  const passwordReset = await requestpasswordReset(req.body.email);
  res.send(passwordReset);
};

const resetPasswordController = async (req, res) => {
  if (req.body.password === req.body.repeatPassword) {
    const resetPasswordService = await resetPassword(
      req.body.userId, req.body.token, req.body.password,
    );

    res.status(400).send(
      resetPasswordService,
    );
  } else {
    res.status(400).json({
      message: 'Passwords do not match!',
    });
  }
};

module.exports = {
  registerUserController,
  loginController,
  requestResetPasswordController,
  resetPasswordController,
};
