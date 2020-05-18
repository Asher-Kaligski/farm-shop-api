//const bodyParser = require('body-parser');
const startupDebugger = require('debug')('app:startup'); //export DEBUG=app:startup --> export DEBUG= if you don't want to see debug
const dbDebugger = require('debug')('app:db'); //export DEBUG=app:*  (wildcard)
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();
const users = require('./routes/users');
const categories = require('./routes/categories');
const products = require('./routes/products');
const farms = require('./routes/farms');

app.use(helmet());
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/farms', farms);


// Configuration
// export/set  NODE_ENV=development
// startupDebugger('Application name: ' + config.get('name'));
// startupDebugger('Mail server: ' + config.get('mail.host'));
// startupDebugger('Mail password: ' + config.get('mail.password'));



if (app.get('env') === 'development') {

  app.use(morgan('tiny'));
  startupDebugger('Morgan log is enabled');
  //console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

}

// app.get('/', (req, res) => {
//   res.send('Hello World!!!');
// });

// http://localhost:3000/api/products/bread/3
// app.get('/api/products/:category/:id', (req, res) => {
//   res.send(req.params);
// });

//http://localhost:3000/api/products/bread/3?sortBy=name
// app.get('/api/products/:category/:id', (req, res) => {
//   res.send(req.query);
// });
// app.get('/api/products/:id', (req, res) => {
//   res.send(req.params.id);
// });

mongoose.connect('mongodb://localhost/farm-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => dbDebugger('Connected to the MongoDB...'))
  .catch(err => { dbDebugger('Error to connect to MongoDB... ', err) });

const port = process.env.PORT || 3000;

app.listen(port, () => startupDebugger(`Listening on port ${port}`));
