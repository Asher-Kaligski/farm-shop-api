const mongoose = require('mongoose');
const { ShoppingCart, validate } = require('../models/shopping-cart');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.find().sort({ name: 1 });
    res.send(shoppingCarts);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let shoppingCart = await ShoppingCart.findById(req.params.id);
    if (!shoppingCart)
      return res
        .status(404)
        .send('The category with given ID has no been found');

    res.send(shoppingCart);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shoppingCart = new ShoppingCart({ name: req.body.name });
  try {
    shoppingCart = await shoppingCart.save();
    res.send(shoppingCart);
  } catch (e) {
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let shoppingCart = await ShoppingCart.findById(req.params.id);
    if (!shoppingCart)
      res.status(404).send('The category with given ID has not been found');

    shoppingCart.name = req.body.name;
    shoppingCart = await shoppingCart.save();
    res.send(shoppingCart);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let shoppingCart = await ShoppingCart.findByIdAndRemove(req.params.id);
    if (!shoppingCart)
      res.status(404).send('The category with given ID has not been found');

    res.send(shoppingCart);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
