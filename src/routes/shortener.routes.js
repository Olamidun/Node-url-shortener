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

/**
 * @swagger
 * /api/shortener:
 *   get:
 *     summary: Gets list of shortened urls
 *     responses:
 *       200:
 *         description: Ok
 */
shortenerRouter.get('', auth, loggedInUserUrlsController);

/**
 * @swagger
 * /api/shortener/{identifier}:
 *   get:
 *     summary: Fetch One shortened url and its information
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *     responses:
 *         200:
 *           description: Successful
 *         400:
 *           description: Error
 */
shortenerRouter.get('/:identifier', auth, singleUrlController);

/**
* @swagger
* /api/shortener/{identifier}:
*   delete:
*     summary: Deletes a url associated with the identifier supplied. Requires authentication.
*     parameters:
*       - in: path
*         name: identifier
*         required: true
*     responses:
*       204:
*         description: Url Deleted!
*/
shortenerRouter.delete('/:identifier', auth, deleteUrlController);

/**
 * @swagger
 * /api/shortener/{identifier}:
 *   put:
 *     summary: updates a url
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
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
 *       200:
 *         description: Created
 *       400:
 *         description: Error
 */
shortenerRouter.put('/:identifier', auth, updateUrlController);

module.exports = shortenerRouter;
