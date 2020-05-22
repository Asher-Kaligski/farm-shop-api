const auth = require('../middleware/auth');
const farmOwner = require('../middleware/farm-owner');
const mongoose = require('mongoose');
const { Farm, validate, createFarm, updateFarm } = require('../models/farm');
const { User } = require('../models/user');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const farms = await Farm.find().sort({ name: 1 });
  res.send(farms);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Farm.');

  let farm = await Farm.findById(req.params.id);
  if (!farm)
    return res.status(404).send('The farm with given ID has no been found');

  res.send(farm);
});

router.post('/', [auth, farmOwner], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid User.');

  if (!user.roles.includes('FARM_OWNER'))
    return res.status(400).send('The user is not farm owner');

  let farm = await Farm.findOne({ name: req.body.name });
  if (farm)
    return res.status(400).send('The farm with given name already exists');

  const categories = await Category.find().select({ name: 1, _id: 0 });

  const areCategoriesExist = checkCategoriesIfExist(
    categories,
    req.body.categories
  );
  if (!areCategoriesExist)
    return res.status(400).send('Not allowed categories');

  farm = createFarm(user, req.body);

  farm = await farm.save();
  res.send(farm);
});

router.put('/:id', [auth, farmOwner], async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Farm.');

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid User.');

  if (!user.roles.includes('FARM_OWNER'))
    return res.status(400).send('The user is not farm owner');

  const categories = await Category.find().select({ name: 1, _id: 0 });

  const areCategoriesExist = checkCategoriesIfExist(
    categories,
    req.body.categories
  );
  if (!areCategoriesExist)
    return res.status(400).send('Not allowed categories');

  let farm = await Farm.findById(req.params.id);
  if (!farm) res.status(404).send('The farm with given ID has not been found');

  updateFarm(farm, req.body);

  farm = await farm.save();
  res.send(farm);
});

router.delete('/:id', [auth, farmOwner], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return send.status(400).send('Invalid Farm.');

  let farm = await Farm.findByIdAndRemove(req.params.id);
  if (!farm) res.status(404).send('The farm with given ID has not been found');

  res.send(farm);
});

function checkCategoriesIfExist(existCategories, categories) {
  const categoriesArr = existCategories.map((obj) => obj['name']);
  const isIncludesCategories = categories.every((c) =>
    categoriesArr.includes(c)
  );

  return isIncludesCategories;
}

module.exports = router;
