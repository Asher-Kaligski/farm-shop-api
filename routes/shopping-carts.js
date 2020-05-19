const mongoose = require('mongoose');
const { ShoppingCart, validateItem } = require('../models/shopping-cart');
const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.find().sort({ dateCreated: -1 });
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
        .send('The shopping cart with given ID has no been found');

    res.send(shoppingCart);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
  let shoppingCart = new ShoppingCart();
  try {
    shoppingCart = await shoppingCart.save();
    res.send(shoppingCart);
  } catch (e) {
    throw new Error(e);
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

// router.put('/:id', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) res.status(400).send(error.details[0].message);

//   try {
//     let shoppingCart = await ShoppingCart.findById(req.params.id);
//     if (!shoppingCart)
//       res.status(404).send('The shopping cart with given ID has not been found');

//     shoppingCart.name = req.body.name;
//     shoppingCart = await shoppingCart.save();
//     res.send(shoppingCart);
//   } catch (e) {
//     res.status(500).send('Unexpected error: ', e);
//   }
// });
///:id/:productId
router.put('/:id', async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let shoppingCart = await ShoppingCart.findById(req.params.id);
    if (!shoppingCart)
      res
        .status(404)
        .send('The shopping cart with given ID has not been found');

    const product = await Product.findById(req.body.productId);
    if (!product)
      res.status(404).send('The product with given ID has not been found');

    const productInCart = shoppingCart.items.filter(
      (item) => item.productId === product._id
    );

    let item = {};
    if (productInCart.length < 1) {
      item.productId = product._id;
      item.quantity = req.body.quantity;
      item.itemTotalPrice = item.quantity * product.price;
      shoppingCart.items.push(item);
    }

    shoppingCart = await shoppingCart.save();
    res.send(shoppingCart);
  } catch (e) {
    throw new Error(e);
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
