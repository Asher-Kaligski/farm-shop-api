const auth = require('../middleware/auth');
const farmOwner = require('../middleware/farm-owner');
const mongoose = require('mongoose');
const {ADMIN} = require('../constants/roles');
const {
  Product,
  validate,
  createProduct,
  updateProduct,
} = require('../models/product');
const { Farm } = require('../models/farm');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find().sort({ price: 1 }).select({__v: 0});
  res.send(products);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid Product.');

  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).send('The product with given ID has no been found');

  res.send(product);
});

router.post('/', [auth, farmOwner], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const farm = await Farm.findById(req.body.farmId);
  if (!farm)
    return res
      .status(400)
      .send('Could not create product the farm has not been found');

  if (req.user._id !== farm.farmOwner._id.toString() && !req.user.roles.includes(ADMIN))
    return res
      .status(400)
      .send('Could not create product, not allowed farm');

  const categories = await Farm.find({ _id: farm._id }).select({
    categories: 1,
    _id: 0,
  });
  const categoriesArr = categories.map((obj) => obj['categories']);
  if (!categoriesArr[0].includes(req.body.category))
    return res.status(400).send('Not allowed category');

  let product = createProduct(req.body, farm);
  product = await product.save();

  res.send(product);
});

router.put('/:id', [auth, farmOwner], async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid Product.');

  let product = await Product.findById(req.params.id);
  if (!product)
    res.status(404).send('The product with given ID has not been found');

  let farm = await Farm.findById(req.body.farmId);
  if (!farm)
    return res
      .status(400)
      .send('Could not update product the farm has not been found');

  if (req.user._id !== farm.farmOwner._id.toString() && !req.user.roles.includes(ADMIN))
    return res
      .status(400)
      .send('Could not update product, not allowed farm');

  const categories = await Farm.find({ _id: farm._id }).select({
    categories: 1,
    _id: 0,
  });
  const categoriesArr = categories.map((obj) => obj['categories']);
  if (!categoriesArr[0].includes(req.body.category))
    return res.status(400).send('Not allowed category');

  updateProduct(product, req.body);

  product = await product.save();

  res.send(product);
});

router.delete('/:id', [auth, farmOwner], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid Product.');

  let product = await Product.findById(req.params.id);
  if (!product)
    res.status(404).send('The product with given ID has not been found');

  let farm = await Farm.findById(product.farm._id);
  if (!farm)
    return res
      .status(400)
      .send('Could not update product the farm has not been found');

  if (req.user._id !== farm.farmOwner._id.toString() && !req.user.roles.includes(ADMIN))
    return res
      .status(400)
      .send('Could not delete product, not allowed farm');

  product = await Product.findByIdAndRemove(req.params.id);


  res.send(product);
});

module.exports = router;
