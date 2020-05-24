const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { NAME_MIN_LENGTH, NAME_MAX_LENGTH } = require('./farm');

const CATEGORY_MIN_LENGTH = 2;
const CATEGORY_MAX_LENGTH = 50;

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 50;

const PRICE_MIN = 0.01;
const PRICE_MAX = 10000;

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: NAME_MIN_LENGTH,
    maxlength: NAME_MAX_LENGTH
  },
});

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    minlength: CATEGORY_MIN_LENGTH,
    maxlength: CATEGORY_MAX_LENGTH,
  },
  imageUrl: {
    type: String,
    default:
      '',
  },
  price: {
    type: Number,
    required: true,
    min: PRICE_MIN,
    max: PRICE_MAX,
  },
  title: {
    type: String,
    required: true,
    minlength: TITLE_MIN_LENGTH,
    maxlength: TITLE_MAX_LENGTH,
  },
  farm: {
    type: farmSchema,
    required: true,
  }
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    category: Joi.string()
      .min(CATEGORY_MIN_LENGTH)
      .max(CATEGORY_MAX_LENGTH)
      .required(),
    imageUrl: Joi.string(),
    price: Joi.number().min(PRICE_MIN).max(PRICE_MAX).required(),
    title: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH).required(),
    farmId: Joi.objectId().required(),
  });

  //return schema.validate(product, farm);
  return schema.validate(product);
}

function createProduct(reqBody, farm) {
  const product = new Product({
    category: reqBody.category,
    imageUrl: reqBody.imageUrl,
    price: reqBody.price,
    title: reqBody.title,
    farm: {
      _id: farm._id,
      name: farm.name,
    },
  });

  return product;
}

function updateProduct(product, reqBody) {
  (product.category = reqBody.category),
    (product.imageUrl = reqBody.imageUrl),
    (product.price = reqBody.price),
    (product.title = reqBody.title);
}

module.exports.Product = Product;
module.exports.validate = validateProduct;
module.exports.createProduct = createProduct;
module.exports.updateProduct = updateProduct;
module.exports.productSchema = productSchema;
