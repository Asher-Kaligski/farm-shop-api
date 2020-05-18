const mongoose = require('mongoose');
const {Farm, validate} = require('../models/farm');
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
      return res
        .status(404)
        .send('The farm with given ID has no been found');

    res.send(farm);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let farm = new Farm({ name: req.body.name });
  try {
    farm = await farm.save();
    res.send(farm);
  } catch (e) {
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm)
      res.status(404).send('The category with given ID has not been found');

    farm.name = req.body.name;
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
      res.status(404).send('The category with given ID has not been found');

    res.send(farm);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
