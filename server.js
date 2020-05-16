const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

// http://localhost:3000/api/products/bread/3
// app.get('/api/products/:category/:id', (req, res) => {
//   res.send(req.params);
// });

//http://localhost:3000/api/products/bread/3?sortBy=name
app.get('/api/products/:category/:id', (req, res) => {
  res.send(req.query);
});
app.get('/api/products/:id', (req, res) => {
  res.send(req.params.id);
});

const port = process.env.PORT || 3000;

app.listen(port , () => console.log(`Listening on port ${port}`));
