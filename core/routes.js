
const error = require('../middleware/error');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

const startupDebugger = require('debug')('app:startup');
const routesDebugger = require('debug')('app:routes');

const users = require('../routes/users');
const auth = require('../routes/auth');
const categories = require('../routes/categories');
const products = require('../routes/products');
const farms = require('../routes/farms');
const shoppingCarts = require('../routes/shopping-carts');
const orders = require('../routes/orders');


module.exports = function (app) {
    
    if (process.env.NODE_ENV === 'development') {
        startupDebugger(`NODE_ENV: ${process.env.NODE_ENV}`);
        startupDebugger('Application name: ' + config.get('name'));
        startupDebugger('Mail server: ' + config.get('mail.host'));
        //startupDebugger('Mail password: ' + config.get('mail.password'));
        startupDebugger('Morgan log is enabled');
        app.use(
          morgan('combined', { stream: { write: (msg) => routesDebugger(msg) } })
        );
      }
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

}