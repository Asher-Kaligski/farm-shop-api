const mongoose = require('mongoose');
const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ name: 1 });
    res.send(orders);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let orders = await Order.findById(req.params.id);
    if (!orders)
      return res
        .status(404)
        .send('The category with given ID has no been found');

    res.send(orders);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

  let orders = new Order({ name: req.body.name });
  try {
    orders = await orders.save();
    res.send(orders);
  } catch (e) {
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

router.put('/:id', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) res.status(400).send(error.details[0].message);

  try {
    let order = await Order.findById(req.params.id);
    if (!order)
      res.status(404).send('The category with given ID has not been found');

    order.name = req.body.name;
    order = await order.save();
    res.send(order);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let order = await Order.findByIdAndRemove(req.params.id);
    if (!order)
      res.status(404).send('The category with given ID has not been found');

    res.send(order);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
