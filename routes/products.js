const mongoose = require('mongoose');
const { Category, validate } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Category.find().sort({ name: 1 });
    res.send(products);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let category = await Product.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .send('The product with given ID has no been found');

    res.send(category);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product({ name: req.body.name });
  try {
    product = await product.save();
    res.send(product);
  } catch (e) {
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let product = await Category.findById(req.params.id);
    if (!product)
      res.status(404).send('The category with given ID has not been found');

    product.name = req.body.name;
    product = await product.save();
    res.send(product);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let product = await Category.findByIdAndRemove(req.params.id);
    if (!product)
      res.status(404).send('The category with given ID has not been found');

    res.send(product);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
