const mongoose = require('mongoose');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {

    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        res.status(500).send('Unexpected error occurred: ', e);
    }

});

router.get('/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('The user with given ID has not been found');

        res.send(user);

    } catch (e) {
        res.status(500).send('Unexpected error occurred: ', e);
    }

});

router.put('/:id', async (req, res) => {

    try {

        const { error } = await validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('The user with given ID has not been found');

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.password = req.body.password;

        user = await user.save();
        res.send(user);

    } catch (e) {

        throw new Error(e);
        // res.status(500).send('Unexpected error occurred: ', e);
    }

});

router.post('/', async (req, res, next) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        let user = await User.find({ email: req.body.email });
        console.log(user)
        if (user.length > 0) return res.status(400).send(`The user with email: ${req.body.email} already exists`);


        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });

       
        user = await user.save();
        res.send(user);


    } catch (e) {
        //  throw new Error(e);
        // process.exit(1);
        res.status(500).send('Unexpected error occurred: ', e);
    }

});

router.delete('/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send('The user with given ID has not been found');

        res.send(user);

    } catch (e) {
        res.status(500).send('Unexpected error occurred: ', e);
    }

});



module.exports = router;