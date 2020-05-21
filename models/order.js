const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const shippingSchema = require('../models/shipping');
const shoppingCartSchema = require('../models/shopping-cart');

const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
  });

const orderSchema = new mongoose.Schema({

    datePlaced: {
        type: Date,
        default: Date.now
    },

    shipping: shippingSchema,
    customer: {
        type: customerSchema,
        required: true
    },
    shoppingCart: {
        type: shoppingCartSchema,
        required: true
    }


});

const Order = mongoose.model('Order', orderSchema);


function validateOrder(params) {

    const schema = Joi.object({

      customerId: Joi.objectId().required(),
      shoppingCartId: Joi.objectId().required(),
       shippingId: Joi.objectId()

    });
    
}


module.exports.Order = Order;
module.exports.validate = validateOrder;


// "datePlaced" : 1582201277271,
// "items" : [ {
//   "product" : {
//     "imageUrl" : "http://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg",
//     "price" : 2.5,
//     "title" : "Spinach"
//   },
//   "quantity" : 7,
//   "totalPrice" : 17.5
// }, {
//   "product" : {
//     "imageUrl" : "https://static.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg",
//     "price" : 3,
//     "title" : "Freshly Baked Bread"
//   },
//   "quantity" : 2,
//   "totalPrice" : 6
// } ],
// "shipping" : {
//   "addressLine1" : "test",
//   "addressLine2" : "test",
//   "city" : "test",
//   "name" : "test"
// }