const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const shippingSchema = require('../models/shipping');
const shoppingCartSchema = require('../models/shopping-cart');



const orderSchema = new mongoose.Schema({

    datePlaced: {
        type: Date,
        default: Date.now
    },

    shippingId: shippingSchema,
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shoppingCartId: {
        type: shoppingCartSchema,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: true
    }


});

const Order = mongoose.model('Order', orderSchema);


function validateOrder(params) {

    const schema = Joi.object({

      customerId: Joi.string().required(),
      shoppingCartId: Joi.string().required(),
      shippingId: Joi.string().required()

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