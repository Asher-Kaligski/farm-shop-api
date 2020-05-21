const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 30;

const PHONE_MIN_LENGTH = 5;
const PHONE_MAX_LENGTH = 30;

const DEFAULT_FEE = 5;

const farmSchema = new mongoose.Schema({
  farmOwner: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    type: new mongoose.Schema({
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
    }),
    required: true
  },
  address: String,
  name: {
    type: String,
    required: true,
    minlength: NAME_MIN_LENGTH,
    maxlength: NAME_MAX_LENGTH,
    unique: true
  },

  categories: [String],
  phone: {
    type: String,
    required: true,
    minlength: PHONE_MIN_LENGTH,
    maxlength: PHONE_MAX_LENGTH,
  },
  fee: {
    type: Number,
    default: DEFAULT_FEE,
  },

  imgUrl: String,
});

const Farm = new mongoose.model('Farm', farmSchema);

function validateFarm(farm) {
  const schema = Joi.object({
    name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
    categories: Joi.array().items(Joi.string()).required(),
    phone: Joi.string().min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH).required(),
    fee: Joi.number().min(1),
    farmOwnerId: Joi.objectId().required()

  });

  return schema.validate(farm);
  // farmOwnerId: Joi.object().ref().required()
}

module.exports.Farm = Farm;
module.exports.validate = validateFarm;
