const mongoose = require('mongoose');
const { Order, validate, createOrder } = require('../models/order');
const { ShoppingCart } = require('../models/shopping-cart');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const customer = require('../middleware/customer');
const { ADMIN } = require('../constants/roles');
const Fawn = require('fawn');

const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', [auth, customer], async (req, res) => {
  let orders;
  if (req.user.roles.includes(ADMIN))
    orders = await Order.find().sort({
      datePlaced: 1,
    });
  else
    orders = await Order.find({ 'customer._id': req.user._id }).sort({
      datePlaced: 1,
    });

  if (orders.length === 0)
    return res.status(404).send('Orders have not been found');

  res.send(orders);
});

router.get('/:id', [auth, customer], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid Order.');

  let order = await Order.findById(req.params.id).select({ __v: 0 });
  if (!order)
    return res.status(404).send('The order with given ID has no been found');

  if (
    order.customer._id.toString() !== req.user._id &&
    !req.user.roles.includes(ADMIN)
  )
    return res.status(400).send('Invalid user.');

  res.send(order);
});

router.post('/', [auth, customer], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.customerId !== req.user._id && !req.user.roles.includes(ADMIN))
    return res.status(400).send('Invalid user.');

  const user = await User.findById(req.body.customerId);
  if (!user) return res.status(400).send('Invalid User.');

  let shoppingCart = await ShoppingCart.find({
    $and: [{ _id: req.body.shoppingCartId }, { orderId: null }],
  });

  if (shoppingCart.length !== 1)
    return res.status(400).send('Invalid shoppingCart');

  let order = await Order.find({
    $and: [
      { 'shoppingCart._id': req.body.shoppingCartId },
      { 'customer._id': req.body.customerId },
    ],
  });
  if (order.length > 0)
    return res
      .status(400)
      .send('The order with given shoppingCart already exists');

  order = createOrder(user, shoppingCart[0], req.body.shipping);

  new Fawn.Task()
    .save('orders', order)
    .update(
      'shopping-carts',
      { _id: shoppingCart[0]._id },
      { orderId: order._id }
    )
    .run({ useMongoose: true });

  res.send(order);
});

router.delete('/:id', [auth, customer], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid Order.');

  let order = await Order.findById(req.params.id);
  if (!order)
    res.status(404).send('The order with given ID has not been found');

  if (
    order.customer._id.toString() !== req.user._id &&
    !req.user.roles.includes(ADMIN)
  )
    return res.status(400).send('Invalid user.');

  Fawn.Task()
    .remove('shopping-carts', { _id: order.shoppingCart._id })
    .remove('orders', { _id: order._id })
    .run({ useMongoose: true });

  res.send(order);
});

module.exports = router;
