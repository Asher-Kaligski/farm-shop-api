require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const startupDebugger = require('debug')('app:startup'); 
const dbDebugger = require('debug')('app:db');
const requestDebugger = require('debug')('app:routes');
const exceptionDebugger = require('debug')('app:uncaught-exception');
const unhandledRejection = require('debug')('app:unhandled-rejection');
const config = require('config');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();

const users = require('./routes/users');
const auth = require('./routes/auth');
const categories = require('./routes/categories');
const products = require('./routes/products');
const farms = require('./routes/farms');
const shoppingCarts = require('./routes/shopping-carts');
const orders = require('./routes/orders');

winston.add(winston.transports.File, {
  filename: 'error.log',
  level: 'error',
  handleExceptions : true
});

winston.handleExceptions(winston.transports.File, {
  filename: 'uncaughtException.log'
});

winston.add(winston.transports.MongoDB, {
  db: 'mongodb://localhost/farm-shop',
  level: 'warn',
});


process.on('uncaughtException', (e) => {
  winston.error(e.message, e);
  exceptionDebugger('uncaughtException: ', e.message);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  winston.error(e.message, e);
  unhandledRejection('unhandledRejection', e.message);
  process.exit(1);
});

if (!config.get('jwtPrivateKey')) {
  startupDebugger('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

if (process.env.NODE_ENV === 'development') {
  startupDebugger(`NODE_ENV: ${process.env.NODE_ENV}`);
  startupDebugger('Morgan log is enabled');
  app.use(
    morgan('combined', { stream: { write: (msg) => requestDebugger(msg) } })
  );
  // Configuration
  // export/set  NODE_ENV=development
  // startupDebugger('Application name: ' + config.get('name'));
  // startupDebugger('Mail server: ' + config.get('mail.host'));
  // startupDebugger('Mail password: ' + config.get('mail.password'));
}

mongoose
  .connect('mongodb://localhost/farm-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => dbDebugger('Connected to the MongoDB...'))
  .catch((err) => {
    dbDebugger('Error to connect to MongoDB... ', err);
  });

app.use(helmet());
app.use(express.json());

app.use('/api/users', users);
app.use('/api/categories', categories);
app.use('/api/products', products);
app.use('/api/farms', farms);
app.use('/api/shoppingCarts', shoppingCarts);
app.use('/api/orders', orders);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => startupDebugger(`Listening on port ${port}`));
