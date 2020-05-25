const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
  mongoose
    .connect('mongodb://localhost/farm-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info('Connected to the MongoDB...');
    });
};
