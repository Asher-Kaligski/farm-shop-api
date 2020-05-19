const mongoose = require('mongoose');


const shippingSchema = new mongoose.Schema({

   country: String,
   city: String,
   address: String,
   postCode: String,
   notes: {
      type: String,
      maxlength: 255
   }


});


module.exports.shippingSchema = shippingSchema;