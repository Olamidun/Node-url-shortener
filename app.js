require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const shortenerRouter = require('./src/routes/shortener.routes');
const authRouter = require('./src/routes/auth.routes');
const client = require('./src/services/redisService');

const app = express();

app.use(cors());

// middleware used to recognize the incoming request as a JSON object.
app.use(express.json());

// middleware used to recognize the incoming request as strings or arrays.
app.use(express.urlencoded({ extended: false }));
// console.log(process.env.REDIS_HOST);
// console.log(process.env.REDIS_PORT);
// console.log(process.env.REDIS_PASSWORD);
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL shortener API',
      version: '1.0.0',
      description: 'A URL shortener API',
      termsOfService: 'http://example.com/terms/',
      contact: {
        name: 'Olamidun',
        url: 'https://www.github.com/Olamidun',
        email: 'kolapoolamidun@gmail.com',
      },
    },

    servers: [
      {
        url: 'http://localhost:100',
        description: 'My API Documentation',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpecs = swaggerJsDoc(options);

if (process.env.NODE_ENV === 'development') {
  try {
    mongoose.connect('//mongodb://localhost:27017/shrty', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  } catch (err) {
    console.log(err);
  }
} else {
  try {
    mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
    });
  } catch (err) {
    console.log(err);
  }
}

client();
// client.on('Connect', () => {
//   console.log('Connected');
// });
//
// client.on('ready', () => {
//   console.log('Connected to redis and ready for use');
// });
//
// client.on('error', (error) => {
//   console.log(error.message);
// });
//
// client.on('end', () => {
//   console.log('Redis has been disconnected');
// });

// Routes
app.use('/api/shortener', shortenerRouter);
app.use('/api/auth', authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(process.env.PORT || 100, () => {
  console.log('Server is running');
});

// middleware to respond to 404 errors
app.use((req, res) => {
  res.status(404).send({
    error: true,
    message: 'Resource cannot be found',
  });
});

// for testing
module.exports = app;
