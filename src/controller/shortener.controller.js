const { cache } = require('joi');
const validator = require('validator');
// const redis = require('redis');
const Url = require('../models/shortener');

const cacheClient = require('../services/redisService');

const createShortenedUrlController = async (req, res) => {
  // function that creates random 4 letter string to be used as identifier for shortened urls.
  try {
    const randomCharacter = () => {
      const result = [];
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 4; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
      }
      return result.join('');
    };
    const checkUrl = validator.isURL(req.body.url);
    if (checkUrl !== true) {
      res.status(400).json({
        status: 'error', message: 'Invalid url',
      });
    }
    const url = new Url({
      url: req.body.url,
      randomCharacters: randomCharacter(),
      owner: req.user,
    });
    const createdUrl = await url.save();
    await cacheClient.delAsync('url');
    res.status(201).json({
      status: 'created', createdUrl,
    });
  } catch (err) {
    console.log('ERROR!!!!!!!', err);
    res.status(400).json({
      error: err.errors.randomCharacters.message,
    });
  }
};

const loggedInUserUrlsController = async (req, res) => {
  const url = await Url.find({ owner: req.user._id});
  // console.log(url)
  const numberOfUrl = await Url.find({ owner: req.user._id }).countDocuments({}, (err, count) => {
    if (err) {
      return err;
    }
    return count;
  });
  if (url.length !== 0) {
    // try {
    const data = await cacheClient.getAsync('url');
    console.log(data);
    if (data) {
      console.log('Getting data from cache');
      res.status(200).json(JSON.parse(data));
    } else {
      await cacheClient.setAsync('url', JSON.stringify({ url, numberOfUrl }));
      res.status(200).json({ url, numberOfUrl });
    }
    // } catch (err) {
    //   res.status(500).json({ error: err.message });
    // }
  } else {
    res.status(200).json({
      message: 'You do not have any URL created',
    });
  }
};

const singleUrlController = async (req, res) => {
  try {
    const query = Url.where({ randomCharacters: req.params.identifier });
    await query.findOne((err, url) => {
      if (url) {
        res.status(200).json({
          status: 'fetched',
          url,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'URl with that identifier does not exist',
        });
      }
    });
  } catch (err) {
    res.json({
      err,
    });
  }
};

const deleteUrlController = async (req, res) => {
  try {
    const query = Url.where({ randomCharacters: req.params.identifier });
    console.log(req.params.identifier);

    await query.findOne((err, url) => {
      if (url) {
        if (url.owner == req.user._id) {
          url.delete();
        } else {
          res.status(401).json({ error: 'You cannot access this url as you were not the one that shortened it' });
        }
      } else {
        res.status(400).json({
          status: 'error',
          message: 'URl with that identifier does not exist',
        });
      }
    });
    await cacheClient.del('url');
    res.status(204).json({
      message: 'Url deleted!',
    });
  } catch (err) {
    res.json({
      err,
    });
  }
};

const updateUrlController = async (req, res) => {
  try {
    const query = Url.where({ randomCharacters: req.params.identifier });
    console.log(req.params.identifier);

    await query.findOne((err, url) => {
      if (url) {
        if (url.owner == req.user._id) {
          url.url = req.body.url;
          url.save();
          res.status(200).json({
            status: 'Url has been updated successfully',
          });
        } else {
          res.status(401).json({ status: 'You cannot edit this url as you did not create it' });
        }
      } else {
        res.status(400).json({
          status: 'error',
          message: 'URl with that identifier does not exist',
        });
      }
    });
    await cacheClient.del('url');
    res.status(204).json({
      message: 'Url deleted!',
    });
  } catch (err) {
    res.json({
      err,
    });
  }
};

module.exports = {
  createShortenedUrlController,
  loggedInUserUrlsController,
  singleUrlController,
  deleteUrlController,
  updateUrlController,
};
