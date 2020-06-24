const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {shippingSchema, joiShippingSchema} = require('../models/shipping');
const {
  itemSchema,
  TOTAL_PRICE_MIN,
  TOTAL_PRICE_MAX,
} = require('../models/shopping-cart');
const { userShortSchema } = require('./user');

const shoppingCartSchema = new mongoose.Schema({
  items: [itemSchema],
  totalPrice: {
    type: Number,
    min: TOTAL_PRICE_MIN,
    max: TOTAL_PRICE_MAX,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  datePlaced: {
    type: Date,
    default: Date.now,
  },

  shipping: shippingSchema,

  shoppingCart: {
    type: shoppingCartSchema,
    required: true,
  },
  customer: {
    type: userShortSchema,
    required: true,
  },
});

function createOrder(user, shoppingCart, shipping) {
  
  const order = new Order({
    customer: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
          },
    shipping: shipping,
    shoppingCart: shoppingCart
  });
  return order;
}

const Order = mongoose.model('Order', orderSchema);



function validateOrder(order) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    shoppingCartId: Joi.objectId().required(),
    shipping: joiShippingSchema,
  });

  return schema.validate(order);
}



module.exports.createOrder = createOrder;
module.exports.Order = Order;
module.exports.validate = validateOrder;
