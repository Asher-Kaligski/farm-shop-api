const mongoose = require('mongoose');
const { Category, validate } = require('../models/category');
const express = require('express');
const router = express.Router();
//const Joi = require('@hapi/joi');



router.get('/', (req, res) => {

    res.send(['bread', 'dairy']);

});

router.post('/', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    res.send(req.body);

});





module.exports = router;


