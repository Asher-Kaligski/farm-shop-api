const winston = require('winston');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./core/logging')();
require('./core/routes')(app);
require('./core/db')();
require('./core/config')();

const port = process.env.PORT || 3000;

app.listen(port, () => winston.info(`Listening on port ${port}`));


