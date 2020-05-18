const mongoose = require('mongoose');


const shippingSchema = new mongoose.Schema({

   country: String,
   city: String,
   address: String,
   postCode: String,


});


module.exports.shippingSchema = shippingSchema;