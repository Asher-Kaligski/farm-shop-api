const winston = require('winston');
const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost/farm-shop';

module.exports = function () {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info(`Connected to the ${DB_URL}`);
    });
};
