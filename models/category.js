const mongoose = require('mongoose');
const Joi = require('@hapi/joi');





const categorySchema = new mongoose.Schema({

   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
   }

});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {

   const schema = Joi.object({
      name: Joi.string()
         .min(3)
         .max(30)
         .required()
   });

   //return schema.validate(category);
   return schema.validate(category);
   // const schema = {
   //    name: Joi.string().min(3).required()
   // }

   // return Joi.validate(category, schema);
}

module.exports.validate = validateCategory;
module.exports = Category;