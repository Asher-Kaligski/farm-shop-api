const mongoose = require('mongoose');
const { Product, validate } = require('../models/product');
const { Farm } = require('../models/farm');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ price: 1 });
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
  try {


    let farm = await Farm.findById(req.body.farmId);
    if (!farm) return res.status(400).send('Could not create product the farm has not been found');

    let product = new Product({
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      title: req.body.title,
      farmId: req.body.farmId
    });

    product = await product.save();
    res.send(product);
  } catch (e) {
    // res.status(500).send('Unexpected error occurred: ', e);
    throw new Error(e);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let product = await Product.findById(req.params.id);
    if (!product) res.status(404).send('The product with given ID has not been found');

    let farm = await Farm.findById(req.body.farmId);
    if (!farm) return res.status(400).send('Could not update product the farm has not been found');


    product.category = req.body.category,
      product.imageUrl = req.body.imageUrl,
      product.price = req.body.price,
      product.title = req.body.title,


      product = await product.save();
    res.send(product);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let product = await Product.findByIdAndRemove(req.params.id);
    if (!product)
      res.status(404).send('The product with given ID has not been found');

    res.send(product);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
