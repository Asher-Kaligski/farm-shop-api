const mongoose = require('mongoose');
const Joi = require('@hapi/joi');


const itemSchema = new mongoose.Schema({


   imgUrl: String,
   price: {
      type: Number,
      min:0,
      max: 10000
   },
   quantity: {
      type: Number,
      min:0,
      max: 1000
   },
   title: String,
   category: String


});

const shoppingCartSchema = new mongoose.Schema({

   dateCreated: {
      type: Date,
      default: Date.now
   },
   customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },
   items: [itemSchema]
});


const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

function validateShoppingCart(shoppingCart) {
   

   const schema = Joi.object({
        items: Joi.number()
   });

   return schema.validate(shoppingCart);

}
https://github.com/hapijs/joi/issues/1657

// const articleSchema = Joi.object({
//    name: Joi.string().required(),
//    created: Joi.date()
//  });
//  const userSchema = Joi.object({
//    username: Joi.string().trim().required(),
//    articles: Joi.array().items(articleSchema)
//  });


module.exports.ShoppingCart = ShoppingCart;
module.exports.validate = validateShoppingCart;