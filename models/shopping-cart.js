const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {PRICE_MIN , PRICE_MAX} = require('./product');
const {userShortSchema} = require('./user');


const CATEGORY_MIN_LENGTH = 2;
const CATEGORY_MAX_LENGTH = 30;

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 30;

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
    maxlength: CATEGORY_MAX_LENGTH
  },
  imageUrl: {
    type: String,
    default: "http://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg"
  },
  price: {
    type: Number,
    required: true,
    min: PRICE_MIN,
    max: PRICE_MAX,
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
    type: userShortSchema,
    required: true
  },
  items: [itemSchema],
  totalPrice: {
    type: Number,
    min: TOTAL_PRICE_MIN,
    max: TOTAL_PRICE_MAX,
    default: 0,
    required: true,
    get: v => v.toFixed(2),
    set: v => v.toFixed(2)

  },
  orderId: {
    type: String,
    default: null
  }
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);



const joiItemSchema = Joi.object({

  productId: Joi.objectId().required(),
  quantity: Joi.number().min(ITEM_QUANTITY_MIN).max(ITEM_QUANTITY_MAX).required()

});

function validateItem(item) {

  return joiItemSchema.validate(item);

}

function validateShoppingCart(shoppingCart) {

  const schema = Joi.object({
    items: Joi.array().items(joiItemSchema).allow(null).allow('').required(),
    userId: Joi.objectId().required()
  });

  return schema.validate(shoppingCart);

}

function addItemsToArray(products, items) {
  let itemsArr = [];
  products.forEach((product) => {
    const productInCart = items.filter(
      (e) => e.productId === product._id.toString()
    );
    const item = createItem(product, productInCart[0].quantity);

    itemsArr.push(item);
  });
  return itemsArr;
}

function createItem(product, productQuantity) {
  const totalPrice = productQuantity * product.price;
  const item = {
    product: {
      _id: product._id,
      price: product.price,
      title: product.title,
      category: product.category,
      imageUrl: product.imageUrl,
    },
    quantity: productQuantity,
    itemTotalPrice: totalPrice,
  };
  return item;
}



function updateItem(shoppingCart, price, quantity, index) {

  shoppingCart.items[index].product.price = price;
  shoppingCart.items[index].quantity = quantity;
  shoppingCart.items[index].itemTotalPrice =
    quantity * price;
}



function removeItem(shoppingCart, index) {
  shoppingCart.items.id(shoppingCart.items[index]._id).remove();
}


function calculateTotalPrice(items) {
  let total = 0;

  if (items.length > 0)
    total = items.reduce(
      (accumulator, item) => accumulator + +item.itemTotalPrice,
      total
    );

  return total;
}

function createShoppingCart(user,itemsArr, total) {
  const shoppingCart = new ShoppingCart({
    customer: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    },
    items: itemsArr,
    totalPrice: total,
  });

  return shoppingCart;
}

module.exports.createShoppingCart = createShoppingCart;
module.exports.addItemsToArray = addItemsToArray;
module.exports.removeItem = removeItem;
module.exports.updateItem = updateItem;
module.exports.createItem = createItem;
module.exports.calculateTotalPrice = calculateTotalPrice;
module.exports.ShoppingCart = ShoppingCart;
module.exports.validateItem = validateItem;
module.exports.validateShoppingCart = validateShoppingCart;
module.exports.itemSchema = itemSchema;
