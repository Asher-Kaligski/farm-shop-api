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

router.post('/', async (req, res) => {

    
    
    try {

        const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let category = new Category({ name: req.body.name });
        category = await category.save();
        res.send(category);

    } catch (e) {
        
        res.status(500).send('Unexpected error occurred: ', e)
    }


});





module.exports = router;


