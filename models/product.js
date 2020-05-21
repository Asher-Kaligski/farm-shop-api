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
    },
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    }
});


const Product = mongoose.model('Product', productSchema);


function validateProduct(product) {
    
    const schema = Joi.object({

        category: Joi.string().min(CATEGORY_MIN_LENGTH).max(CATEGORY_MAX_LENGTH).required(),
        imageUrl: Joi.string(),
        price: Joi.number().min(PRICE_MIN).max(PRICE_MAX).required(),
        title: Joi.string().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH).required(),
        farmId: Joi.objectId().required()

    });

    return schema.validate(product);
}


module.exports.Product = Product;
module.exports.validate = validateProduct;
module.exports.productSchema = productSchema;