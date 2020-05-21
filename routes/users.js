const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
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


        if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return send.status(400)
            .send('Invalid User.');

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

        if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return send.status(400)
            .send('Invalid User.');

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

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send(`The user with email: ${req.body.email} already exists`);


        // user = new User({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     phone: req.body.phone,
        //     email: req.body.email,
        //     password: req.body.password
        // });
        user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'phone', 'password']));

        const salt = await bcrypt.genSalt(10);
        user.password = bcrypt.hash(user.password, salt);
       
        await user.save();

        
        const token = jwt.sign({_id: user._id}, config.get("jwtPrivateKey"));
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));


    } catch (e) {
        //  throw new Error(e);
        // process.exit(1);
        res.status(500).send('Unexpected error occurred: ', e);
    }

});

router.delete('/:id', async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return send.status(400)
            .send('Invalid User.');

        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send('The user with given ID has not been found');

        res.send(user);

    } catch (e) {
        res.status(500).send('Unexpected error occurred: ', e);
    }

});



module.exports = router;