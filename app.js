require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const shortenerRouter = require('./src/routes/shortener.routes');
const authRouter = require('./src/routes/auth.routes');

const app = express();

app.use(cors());

// middleware used to recognize the incoming request as a JSON object.
app.use(express.json());

// middleware used to recognize the incoming request as strings or arrays.
app.use(express.urlencoded({ extended: false }));

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
        url: 'http://localhost:3000',
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

// try {
//   mongoose.connect('//mongodb://localhost:27017/shrty', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// } catch (err) {
//   console.log(err);
// }
if (process.env.NODE_ENV === 'development') {
  try {
    mongoose.connect('//mongodb://localhost:27017/shrty', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  } catch (err) {
    console.log(err);
    console.log(process.env.REDIS_URL);
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

// try {
//   mongoose.connect(process.env.DATABASE_URI || '//mongodb://localhost:27017/shrty', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// } catch (err) {
//   console.log(err);
//   console.log(process.env.REDIS_URL);
// }

// Routes
app.use('/api/shortener', shortenerRouter);
app.use('/api/auth', authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(3000, () => {
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