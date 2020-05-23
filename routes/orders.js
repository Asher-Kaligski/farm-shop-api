const mongoose = require('mongoose');
const { Order, validate, createOrder } = require('../models/order');
const { User } = require('../models/user');
const { ShoppingCart } = require('../models/shopping-cart');
const auth = require('../middleware/auth');
const customer = require('../middleware/customer');
const Fawn = require('fawn');

const express = require('express');
const router = express.Router();

router.get('/', [auth, customer], async (req, res) => {
  const orders = await Order.find({ 'customer._id': req.user._id }).sort({
    datePlaced: 1,
  });
  res.send(orders);
});

router.get('/:id', [auth, customer], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Order.');

  let orders = await Order.findById(req.params.id);
  if (!orders)
    return res.status(404).send('The order with given ID has no been found');

  res.send(orders);
});

router.post('/', [auth, customer], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shoppingCart = await ShoppingCart.find(
    { _id: req.body.shoppingCartId },
    { 'customer._id': req.body.customerId }
  );
  if (!shoppingCart)
    return res
      .status(400)
      .res('The shoppingCart with given ID has not been found');

  let order = await Order.find(
    { 'shoppingCart._id': req.body.shoppingCartId },
    { 'customer._id': req.body.customerId }
  );
  if (order)
    return res
      .status(400)
      .res('The order with given shoppingCart already exists');

  order = createOrder(shoppingCart, req.body.shipping);
  
  new Fawn.Task()
    .save('orders', order)
    .update(
      'shoppingcarts',
      { _id: shoppingCart._id },
      { orderId: order._id.toString() }
    )
    .run();

  res.send(order);
});



router.put('/:id',[auth, customer], async (req, res) => {
 

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return send.status(400).send('Invalid Order.');

    let order = await Order.findById(req.params.id);
    if (!order)
      res.status(404).send('The category with given ID has not been found');

    order.name = req.body.name;
    order = await order.save();
    res.send(order);
  
});

router.delete('/:id',[auth, customer], async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return send.status(400).send('Invalid Order.');

    let order = await Order.findByIdAndRemove(req.params.id);
    if (!order)
      res.status(404).send('The category with given ID has not been found');

    res.send(order);
  
});

module.exports = router;
