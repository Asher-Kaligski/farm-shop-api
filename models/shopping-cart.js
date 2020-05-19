const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const itemSchema = new mongoose.Schema({
//   imgUrl: String,
//   price: {
//     type: Number,
//     min: 0.1,
//     max: 10000,
//   },
  quantity: {
    type: Number,
    min: 1,
    max: 1000,
    required: true
  },
  itemTotalPrice: {
    type: Number,
    min: 0.1,
    max: 10000,
  },
  // totalPrice: function () {
  //    this.price * this.quantity;
  // },
//   title: {
//      type: String,
//      required: true
//   },
//   category: {
//    type: String,
//    required: true
// },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});


//const Item = mongoose.model('Item', itemSchema);

const shoppingCartSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [itemSchema],
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  totalPrice: {
    type: Number,
    min: 0,
    max: 100000,
    default: 0,
  },
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);


function validateItem(item) {
   
  const schema = Joi.object({

      productId: Joi.string().required(),
      quantity: Joi.number().min(1).max(10000).required()

  });

  return schema.validate(item);

}

// function validateShoppingCart(shoppingCart) {

//    const schema = Joi.object({
//         items: Joi.number()
//    });

//    return schema.validate(shoppingCart);

// }
//https://github.com/hapijs/joi/issues/1657

// const articleSchema = Joi.object({
//    name: Joi.string().required(),
//    created: Joi.date()
//  });
//  const userSchema = Joi.object({
//    username: Joi.string().trim().required(),
//    articles: Joi.array().items(articleSchema)
//  });

module.exports.ShoppingCart = ShoppingCart;
module.exports.validateItem = validateItem;
