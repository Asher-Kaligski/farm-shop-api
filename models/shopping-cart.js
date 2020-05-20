const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const CATEGORY_MIN_LENGTH = 2;
const CATEGORY_MAX_LENGTH = 30;

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 30;

const PRODUCT_PRICE_MIN = 0.01;
const PRODUCT_PRICE_MAX = 10000;

const ITEM_QUANTITY_MIN = 0;
const ITEM_QUANTITY_MAX = 1000;

const ITEM_TOTAL_PRICE_MIN = 0.01;
const ITEM_TOTAL_PRICE_MAX = 100000;

const TOTAL_PRICE_MIN = 0;
const TOTAL_PRICE_MAX = 1000000;



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
      min: PRODUCT_PRICE_MIN,
      max: PRODUCT_PRICE_MAX,
      get: v => v.toFixed(2),
      set: v => v.toFixed(2)
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
  lastName: String
})

const itemSchema = new mongoose.Schema({

  quantity: {
    type: Number,
    min: ITEM_QUANTITY_MIN,
    max: ITEM_QUANTITY_MAX,
    required: true
  },
  itemTotalPrice: {
    type: Number,
    min: ITEM_TOTAL_PRICE_MIN,
    max: ITEM_TOTAL_PRICE_MAX,
    required: true,
    get: v => v.toFixed(2),
    set: v => v.toFixed(2)
  },
  product: productSchema

});



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
  totalPrice: {
    type: Number,
    min: TOTAL_PRICE_MIN,
    max: TOTAL_PRICE_MAX,
    default: 0,
    required: true
    
  }
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);



const joiItemSchema = Joi.object({

    productId: Joi.string().required(),
    quantity: Joi.number().min(ITEM_QUANTITY_MIN).max(ITEM_QUANTITY_MAX).required()

});

function validateItem(item) {
  
  return joiItemSchema.validate(item);

}

function validateShoppingCart(shoppingCart) {

   const schema = Joi.object({
        items: Joi.array().items(joiItemSchema).allow(null).allow('').required(),
        userId: Joi.string().required()
   });

   return schema.validate(shoppingCart);

}


module.exports.ShoppingCart = ShoppingCart;
module.exports.validateItem = validateItem;
module.exports.validateShoppingCart = validateShoppingCart;
