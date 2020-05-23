const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const shippingSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 50,
  },
  city: {
    type: String,
    minlength: 2,
    maxlength: 50,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  postCode: {
   type: String,
   minlength: 5,
   maxlength: 255,
 },
  notes: {
    type: String,
    minlength: 2,
    maxlength: 255,
  }
});

function validateShipping(shipping) {
   const schema = Joi.object({
    country: Joi.string(),
    city: Joi.string(),
    address: Joi.string(),
    notes: Joi.string(),
    postCode: Joi.string(),
  });
  return schema.validate(shipping);
}

//module.exports.validateShipping = validateShipping;
module.exports.shippingSchema = shippingSchema;
