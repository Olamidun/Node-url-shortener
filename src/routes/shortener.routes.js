const express = require('express');
const {
  createShortenedUrlController, loggedInUserUrlsController,
  singleUrlController, deleteUrlController, updateUrlController,
} = require('../controller/shortener.controller');
const { auth } = require('../utils/token');

const shortenerRouter = express.Router();

/**
 * @swagger
 * /api/shortener:
 *   post:
 *     summary: Shortens a url
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Error
 */
shortenerRouter.post('', auth, createShortenedUrlController);
shortenerRouter.get('', loggedInUserUrlsController);
shortenerRouter.get('/:identifier', auth, singleUrlController);
shortenerRouter.delete('/:identifier', auth, deleteUrlController);
shortenerRouter.put('/:identifier', auth, updateUrlController);

module.exports = shortenerRouter;
