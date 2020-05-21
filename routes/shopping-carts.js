const mongoose = require('mongoose');
const {
  ShoppingCart,
  validateItem,
  validateShoppingCart,
  removeItem,
  updateItem,
  createItem,
  calculateTotalPrice,
  addItemsToArray
} = require('../models/shopping-cart');
const { Product } = require('../models/product');
const { User } = require('../models/user');
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return send.status(400)
        .send('Invalid ShoppingCart.');

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
  const { error } = validateShoppingCart(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid User.');



    const shoppingCarts = await ShoppingCart.find({
      $and: [
        { 'customer._id': req.body.userId },
        { orderId: { $eq: null } }
      ]
    });


    if (shoppingCarts.length > 0)
      return res.status(400).send('The user has already the shopping cart');

    let itemsArr = [];
    if (req.body.items.length > 0) {
      const productIds = req.body.items.map((item) => item.productId);
      let products = await Product.find().where('_id').in(productIds).exec();

      if (!products)
        return res
          .status(400)
          .send('The product with given ID has not been found');

      itemsArr = addItemsToArray(products, req.body.items);

    }

    let total = 0;
    if (itemsArr.length > 0)
     total = calculateTotalPrice(itemsArr);

    let shoppingCart = new ShoppingCart({
      customer: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      items: itemsArr,
      totalPrice: total,
    });

    shoppingCart = await shoppingCart.save();

    res.send(shoppingCart);
  } catch (e) {
    throw new Error(e);
    res.status(500).send('Unexpected error occurred: ', e);
  }
});


router.patch('/:id', async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return send.status(400)
        .send('Invalid ShoppingCart.');

    let shoppingCart = await ShoppingCart.findById(req.params.id);

    if (!shoppingCart)
      res
        .status(404)
        .send('The shopping cart with given ID has not been found');

    const product = await Product.findById(req.body.productId);
    if (!product)
      res.status(404).send('The product with given ID has not been found');

    const productInCart = shoppingCart.items.find(
      (item) => item.product._id.toString() === product._id.toString()
    );
    const indexOfProduct = shoppingCart.items.findIndex(
      (item) => item.product._id.toString() === product._id.toString()
    );

    const productQuantity = +req.body.quantity;
    if (!productInCart) {
      const item = createItem(product, productQuantity);
      shoppingCart.items.push(item);
    } else {
      if (productQuantity === 0)
        removeItem(shoppingCart, indexOfProduct);
      else
        updateItem(shoppingCart, product.price, productQuantity, indexOfProduct);
    }

    shoppingCart.totalPrice = calculateTotalPrice(shoppingCart.items);

    shoppingCart = await shoppingCart.save();

    res.send(shoppingCart);
  } catch (e) {
    throw new Error(e);
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return send.status(400)
        .send('Invalid ShoppingCart.');

    let shoppingCart = await ShoppingCart.findByIdAndRemove(req.params.id);
    if (!shoppingCart)
      res.status(404).send('The shoppingCart with given ID has not been found');

    res.send(shoppingCart);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;



