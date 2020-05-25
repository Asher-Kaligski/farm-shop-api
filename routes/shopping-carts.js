const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const customer = require('../middleware/customer');
const { ADMIN } = require('../constants/roles');
const mongoose = require('mongoose');
const {
  ShoppingCart,
  validateItem,
  validateShoppingCart,
  removeItem,
  updateItem,
  createItem,
  calculateTotalPrice,
  addItemsToArray,
  createShoppingCart,
} = require('../models/shopping-cart');
const { Product } = require('../models/product');
const { Order } = require('../models/order');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();



router.get('/', [auth, admin], async (req, res) => {
  const shoppingCarts = await ShoppingCart.find().sort({ dateCreated: -1 });
  res.send(shoppingCarts);
});

router.get('/:id', [auth, customer], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid ShoppingCart.');

  const shoppingCart = await ShoppingCart.findById(req.params.id).select({
    __v: 0,
  });
  if (!shoppingCart)
    return res
      .status(404)
      .send('The shopping cart with given ID has no been found');

    console.log('shoppingCart.customer._id.toString()', shoppingCart.customer._id.toString())
    console.log('req.user._id', req.user._id)

  if (
    shoppingCart.customer._id.toString() !== req.user._id &&
    !req.user.roles.includes(ADMIN)
  )
    return res.status(400).send('Invalid user');

  res.send(shoppingCart);
});

router.post('/', [auth, customer], async (req, res) => {
  const { error } = validateShoppingCart(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid User.');

  if (user._id.toString() !== req.user._id && !req.user.roles.includes(ADMIN))
    return res.status(400).send('Invalid user');

  const shoppingCarts = await ShoppingCart.find({
    $and: [{ 'customer._id': req.body.userId }, { orderId: { $eq: null } }],
  });

  if (shoppingCarts.length > 0)
    return res.status(400).send('The user has already the shopping cart');

  let itemsArr = [];
  if (req.body.items.length > 0) {
    const productIds = req.body.items.map((item) => item.productId);
    let products = await Product.find().where('_id').in(productIds).exec();

    if (!products)
      return res
        .status(400)
        .send('The product with given ID has not been found');

    itemsArr = addItemsToArray(products, req.body.items);
  }

  let total = 0;
  if (itemsArr.length > 0) total = calculateTotalPrice(itemsArr);

  let shoppingCart = createShoppingCart(user, itemsArr, total);

  shoppingCart = await shoppingCart.save();

  res.send(shoppingCart);
});

router.patch('/:id', [auth, customer], async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid ShoppingCart.');

  let shoppingCart = await ShoppingCart.findById(req.params.id);

  if (!shoppingCart)
    res.status(404).send('The shopping cart with given ID has not been found');

  if (
    shoppingCart.customer._id.toString() !== req.user._id &&
    !req.user.roles.includes(ADMIN)
  )
    return res.status(400).send('Invalid user');

  const product = await Product.findById(req.body.productId);
  if (!product)
    res.status(404).send('The product with given ID has not been found');

  const isProductInCart = shoppingCart.items.find(
    (item) => item.product._id.toString() === product._id.toString()
  );

  const productQuantity = +req.body.quantity;
  if (!isProductInCart) {
    const item = createItem(product, productQuantity);
    shoppingCart.items.push(item);
  } else {
    const indexOfProduct = shoppingCart.items.findIndex(
      (item) => item.product._id.toString() === product._id.toString()
    );
    if (productQuantity === 0) removeItem(shoppingCart, indexOfProduct);
    else
      updateItem(shoppingCart, product.price, productQuantity, indexOfProduct);
  }

  shoppingCart.totalPrice = calculateTotalPrice(shoppingCart.items);

  shoppingCart = await shoppingCart.save();

  res.send(shoppingCart);
});

router.delete('/:id', [auth, customer], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid ShoppingCart.');

  let shoppingCart = await ShoppingCart.findById(req.params.id);
  if (!shoppingCart)
    res.status(404).send('The shoppingCart with given ID has not been found');

  if (
    shoppingCart.customer._id.toString() !== req.user._id &&
    !req.user.roles.includes(ADMIN)
  )
    return res.status(400).send('Invalid user');

  const order = await Order.find({'shoppingCart._id':shoppingCart._id });
  if (order.length > 0 ) 
  return res.status(400).send('Not possible to delete ShoppingCart, the Order with this cart has been already created');

  shoppingCart = await ShoppingCart.findByIdAndRemove(req.params.id);
 

  res.send(shoppingCart);

});

module.exports = router;
