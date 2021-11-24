const express = require('express');
const {
  createShortenedUrlController, loggedInUserUrlsController,
  singleUrlController, deleteUrlController, updateUrlController,
} = require('../controller/shortener.controller');
const { auth } = require('../utils/token');

const shortenerRouter = express.Router();

shortenerRouter.post('', auth, createShortenedUrlController);

/**
 * @swagger
 * /api/shortener:
 *   get:
 *     summary: Returns all shortened urls created by a logged in user
 *     tags: [Urls]
 *     responses:
 *       200:
 *         description: the list of the shortened urls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/src/models/shortener.js'
 */
shortenerRouter.get('', loggedInUserUrlsController);
shortenerRouter.get('/:identifier', auth, singleUrlController);
shortenerRouter.delete('/:identifier', auth, deleteUrlController);
shortenerRouter.put('/:identifier', auth, updateUrlController);

module.exports = shortenerRouter;
