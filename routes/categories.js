const mongoose = require('mongoose');
const { Category, validate } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.send(categories);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400)
        .send('Invalid Category.');

    let category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .send('The category with given ID has no been found');

    res.send(category);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = new Category({ name: req.body.name });
  try {
    category = await category.save();
    res.send(category);
  } catch (e) {
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400)
        .send('Invalid Category.');

    let category = await Category.findById(req.params.id);
    if (!category)
      res.status(404).send('The category with given ID has not been found');

    category.name = req.body.name;
    category = await category.save();
    res.send(category);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400)
        .send('Invalid Category.');

    let category = await Category.findByIdAndRemove(req.params.id);
    if (!category)
      res.status(404).send('The category with given ID has not been found');

    res.send(category);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
