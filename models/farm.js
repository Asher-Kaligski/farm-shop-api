const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 30;

const PHONE_MIN_LENGTH = 5;
const PHONE_MAX_LENGTH = 30;

const DEFAULT_FEE = 5;

const farmSchema = new mongoose.Schema({
  farmOwner: {
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
    maxlength: NAME_MAX_LENGTH
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
}

function createFarm(user, body) {
  const farm = new Farm({
    name: body.name,
    categories: body.categories,
    phone: body.phone,
    fee: body.fee,
    farmOwner: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return farm;
}

function updateFarm(farm, body) {

  farm.name = body.name,
    farm.categories = body.categories,
    farm.phone = body.phone,
    farm.fee = body.fee

}

module.exports.Farm = Farm;
module.exports.validate = validateFarm;
module.exports.createFarm = createFarm;
module.exports.updateFarm = updateFarm;
module.exports.NAME_MIN_LENGTH = NAME_MIN_LENGTH;
module.exports.NAME_MAX_LENGTH = NAME_MAX_LENGTH;
