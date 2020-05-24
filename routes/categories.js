const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const { Category, validate } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.send(categories);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Category.');

  const category = await Category.findById(req.params.id);
  if (!category)
    return res.status(404).send('The category with given ID has no been found');

  res.send(category);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let categories = await Category.find().select({ name: 1, _id: 0 });

  categories = categories.map((obj) => obj.name);

  if (categories.includes(req.body.name))
    return res.status(400).send('The category is already exists');

  let category = new Category({ name: req.body.name });
  category = await category.save();
  res.send(category);
});

router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Category.');

  let category = await Category.findById(req.params.id);
  if (!category)
    res.status(404).send('The category with given ID has not been found');

    let categories = await Category.find().select({ name: 1, _id: 0 });

    categories = categories.map((obj) => obj.name);
  
    if (categories.includes(req.body.name))
      return res.status(400).send('The category is already exists');

  category.name = req.body.name;
  category = await category.save();

  res.send(category);
});

router.delete('/:id', [auth, admin], async (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Category.');

  let category = await Category.findByIdAndRemove(req.params.id);
  if (!category)
    res.status(404).send('The category with given ID has not been found');

  res.send(category);
});

module.exports = router;
