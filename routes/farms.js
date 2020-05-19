const mongoose = require('mongoose');
const { Farm, validate } = require('../models/farm');
const { User } = require('../models/user');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const farms = await Farm.find().sort({ name: 1 });
    res.send(farms);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm)
      return res.status(404).send('The farm with given ID has no been found');

    res.send(farm);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findById(req.body.farmOwnerId);
    if (!user) return res.status(400).send('Invalid User.');
    if (!user.roles.includes('FARM_OWNER'))
      return res.status(403).send("The user doesn't have permission");

    const categories = await Category.find().select({ name: 1, _id: 0 });
    const categoriesArr = categories.map((obj) => obj['name']);
    const isIncludesCategories = req.body.categories.every((c) =>
      categoriesArr.includes(c)
    );
    if (!isIncludesCategories)
      return res.status(400).send('Not allowed categories');

    let farm = await Farm.findOne({ name: req.body.name });
    if (farm)
      return res.status(400).send('The farm with given name already exists');

    farm = new Farm({
      name: req.body.name,
      categories: req.body.categories,
      phone: req.body.phone,
      fee: req.body.fee,
      farmOwner: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    farm = await farm.save();
    res.send(farm);
  } catch (e) {
    throw new Error(e);
    // res.status(500).send('Unexpected error occurred: ', e);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    const user = await User.findById(req.body.farmOwnerId);
    if (!user)
      return res
        .status(404)
        .send('The farm owner with given ID has not been found');
    if (!user.roles.includes('FARM_OWNER'))
      return res.status(403).send("The user doesn't have permission");

    const categories = await Category.find().select({ name: 1, _id: 0 });
    const categoriesArr = categories.map((obj) => obj['name']);
    const isIncludesCategories = req.body.categories.every((c) =>
      categoriesArr.includes(c)
    );
    if (!isIncludesCategories)
      return res.status(400).send('Not allowed categories');

    let farm = await Farm.findById(req.params.id);
    if (!farm)
      res.status(404).send('The farm with given ID has not been found');

    (farm.name = req.body.name),
      (farm.categories = req.body.categories),
      (farm.phone = req.body.phone),
      (farm.fee = req.body.fee),
      (farm.farmOwner = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    farm = await farm.save();
    res.send(farm);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let farm = await Farm.findByIdAndRemove(req.params.id);
    if (!farm)
      res.status(404).send('The farm with given ID has not been found');

    res.send(farm);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
