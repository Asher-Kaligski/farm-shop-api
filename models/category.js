const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;

const categorySchema = new mongoose.Schema({

   name: {
      type: String,
      required: true,
      minlength: NAME_MIN_LENGTH,
      maxlength: NAME_MAX_LENGTH
   }

});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {

   const schema = Joi.object({
      name: Joi.string()
         .alphanum()
         .min(NAME_MIN_LENGTH)
         .max(NAME_MAX_LENGTH)
         .required()
   });

   return schema.validate(category);
  
}

module.exports.validate = validateCategory;
module.exports.Category = Category;