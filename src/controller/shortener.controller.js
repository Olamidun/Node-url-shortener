const redis = require('redis');
const validator = require('validator');
const Url = require('../models/shortener');
const { deleteUrlFromCache } = require('../services/redisService');

const client = redis.createClient();

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
      owner: req.user.id,
    });
    console.log(url);
    const createdUrl = await url.save();
    await deleteUrlFromCache('url');
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
  const url = await Url.find({ });
  // console.log(url)
  const numberOfUrl = await Url.find({ }).countDocuments({}, (err, count) => {
    if (err) {
      return err;
    }
    return count;
  });
  if (url.length !== 0) {
    try {
      client.get('url', (err, data) => {
        if (err) {
          return { err };
        }
        if (data) {
          res.status(200).json(JSON.parse(data));
        } else {
          client.set('url', JSON.stringify({ url, numberOfUrl }));
          res.status(200).json({ url, numberOfUrl });
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(200).json({
      message: 'You do not have any URL created',
    });
  }
};

const singleUrlController = async (req, res) => {
  try {
    const query = Url.where({ randomCharacters: req.params.identifier });
    // console.log(req.params.identifier)

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
  const url = await Url.findOne({ randomCharacters: req.params.identifier });
  try {
    if (req.user.id != url.owner.id) {
      res.status(401).json({ error: 'You cannot access this url as you were not the one that shortened it' });
    }
    await url.delete();
    await deleteUrlFromCache('url');
    res.json({
      message: 'Url deleted!',
    });
  } catch (err) {
    res.json({
      err,
    });
  }
};

const updateUrlController = async (req, res) => {
  const url = await Url.findOne({
    randomCharacters: req.params.identifier,
  });
  console.log(url);

  if (req.user.id == url.owner.id) {
    url.url = req.body.url;
    await url.save();
    await deleteUrlFromCache('url');
    res.status(200).json({
      message: 'Url has been updated successfully',
      url: url.url,
    });
  } else {
    res.status(401).json({ error: 'You cannot access this url as you were not the one that shortened it' });
  }
};

module.exports = {
  createShortenedUrlController,
  loggedInUserUrlsController,
  singleUrlController,
  deleteUrlController,
  updateUrlController,
};
