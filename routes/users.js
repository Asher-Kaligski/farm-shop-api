const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();


router.get('/', [auth, admin], async (req, res) => {

        const users = await User.find();
        res.send(users);
    

});

router.get('/me', auth,  async (req, res) => {


        const user = await User.findById(req.user._id).select({password: 0});
        if (!user) return res.status(404).send('The user with given ID has not been found');

        res.send(user);

    

});

router.put('/:id', auth, async (req, res) => {


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

    

});

router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


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
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));


    

});

router.delete('/:id', [auth, admin], async (req, res) => {


        if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return send.status(400)
            .send('Invalid User.');

        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send('The user with given ID has not been found');

        res.send(user);

    

});



module.exports = router;