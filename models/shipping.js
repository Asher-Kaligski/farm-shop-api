const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const COUNTRY_MIN_LENGTH = 2;
const COUNTRY_MAX_LENGTH = 50;

const CITY_MIN_LENGTH = 2;
const CITY_MAX_LENGTH = 50;

const ADDRESS_MIN_LENGTH = 5;
const ADDRESS_MAX_LENGTH = 255;

const POSTCODE_MIN_LENGTH = 5;
const POSTCODE_MAX_LENGTH = 255;

const NOTES_MIN_LENGTH = 5;
const NOTES_MAX_LENGTH = 255;

const shippingSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: COUNTRY_MIN_LENGTH,
    maxlength: COUNTRY_MAX_LENGTH,
  },
  city: {
    type: String,
    minlength: CITY_MIN_LENGTH,
    maxlength: CITY_MAX_LENGTH,
  },
  address: {
    type: String,
    minlength: ADDRESS_MIN_LENGTH,
    maxlength: ADDRESS_MAX_LENGTH,
  },
  postCode: {
    type: String,
    minlength: POSTCODE_MIN_LENGTH,
    maxlength: POSTCODE_MAX_LENGTH,
  },
  notes: {
    type: String,
    minlength: NOTES_MIN_LENGTH,
    maxlength: NOTES_MAX_LENGTH,
  },
});

const joiShippingSchema = Joi.object({
  country: Joi.string()
    .min(COUNTRY_MIN_LENGTH)
    .max(COUNTRY_MAX_LENGTH)
    .required(),
  city: Joi.string().min(CITY_MIN_LENGTH).max(CITY_MAX_LENGTH).required(),
  address: Joi.string()
    .min(ADDRESS_MIN_LENGTH)
    .max(ADDRESS_MAX_LENGTH)
    .required(),
  notes: Joi.string()
    .min(NOTES_MIN_LENGTH)
    .max(NOTES_MAX_LENGTH)
    .allow('', null),
  postCode: Joi.string()
    .min(POSTCODE_MIN_LENGTH)
    .max(POSTCODE_MAX_LENGTH)
    .required(),
});

module.exports.shippingSchema = shippingSchema;
module.exports.joiShippingSchema = joiShippingSchema;
