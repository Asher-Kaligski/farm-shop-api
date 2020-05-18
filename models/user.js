const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 30;
const PHONE_MIN_LENGTH = 5;
const PHONE_MAX_LENGTH = 30;

const userSchema = new mongoose.Schema({

    roles: {
        type: Array,
        default: ['CUSTOMER']
    }, //ADMIN,CUSTOMER,FARM_OWNER
    firstName: {
        type: String,
        required: true,
        minlength: NAME_MIN_LENGTH,
        maxlength: NAME_MAX_LENGTH
    },
    lastName: {
        type: String,
        required: true,
        minlength: NAME_MIN_LENGTH,
        maxlength: NAME_MAX_LENGTH
    }
    ,
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: PHONE_MIN_LENGTH,
        maxlength: PHONE_MAX_LENGTH
    }
    ,
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9]{8,30}$/]
    }

});


const User = mongoose.model('User', userSchema);

function validateUser(user) {

    const schema = Joi.object({

        firstName: Joi.string().alphanum().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
        lastName: Joi.string().alphanum().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
        phone: Joi.string().min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()

    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
