const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const CATEGORY_MIN_LENGTH = 2;
const CATEGORY_MAX_LENGTH = 30;

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 30;

const PRICE_MIN = 0;
const PRICE_MAX = 1000;



const productSchema = new mongoose.Schema({

  category: {
      type: String,
      required: true,
      minlength: CATEGORY_MIN_LENGTH,
      maxlength:CATEGORY_MAX_LENGTH
  },
  imageUrl: {
      type: String,
      default: "http://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg"
  },
  price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000
  },
  title: {
      type: String,
      required: true,
      minlength: TITLE_MIN_LENGTH,
      maxlength: TITLE_MAX_LENGTH
  }
});


const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
})

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
    required: true
  },
  product: productSchema
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
  // productId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  // },
});


//const Item = mongoose.model('Item', itemSchema);

const shoppingCartSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true
  },
  customer: {
    type: userSchema,
    required: true
  },
  items: [itemSchema],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  totalPrice: {
    type: Number,
    min: 0,
    max: 100000,
    default: 0,
    required: true
  },
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);



const itemSchemaValidate = Joi.object({

    productId: Joi.string().required(),
    quantity: Joi.number().min(1).max(10000).required()

});

function validateItem(item) {
  
  return itemSchemaValidate.validate(item);

}

function validateShoppingCart(shoppingCart) {

   const schema = Joi.object({
        items: Joi.array().items(itemSchemaValidate).allow(null).allow(''),
        userId: Joi.string().required()
   });

   return schema.validate(shoppingCart);

}
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
module.exports.validateShoppingCart = validateShoppingCart;
