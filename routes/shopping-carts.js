const mongoose = require('mongoose');
const { ShoppingCart, validateItem, validateShoppingCart } = require('../models/shopping-cart');
const { Product } = require('../models/product');
const { User } = require('../models/user');
const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.find().sort({ dateCreated: -1 });
    res.send(shoppingCarts);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    //const shoppingCarts = await ShoppingCart.find({ 'customer._id': req.body.userId });
    let shoppingCart = await ShoppingCart.findById(req.params.id);
    if (!shoppingCart)
      return res
        .status(404)
        .send('The shopping cart with given ID has no been found');

    res.send(shoppingCart);
  } catch (e) {
    res.status(500).send('Unexpected error: ', e);
  }
});

router.post('/', async (req, res) => {

  const { error } = validateShoppingCart(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid User.');


    //uncomment after creation any order
    //const orders = await Order.findById(req.body.userId);
    const orders = [];

    const shoppingCarts = await ShoppingCart.find({ 'customer._id': req.body.userId });

     //return with status 400 the shoppingCart._id
    if (shoppingCarts.length > orders.length) return res.status(400).send('The user has already the shopping cart');


    let itemsArr = [];
    if (req.body.items.length > 0) {
      const productIds = req.body.items.map(item => item.productId);
      let products = await Product.find().where('_id').in(productIds).exec();

      if (!products) return res.status(400).send('The product with given ID has not been found');

      products.forEach(prod => {


        const productInCart = req.body.items.filter(e => e.productId === prod._id.toString());

        let totalPrice = prod.price * productInCart[0].quantity;
        item = {
          product: {
            _id: prod._id,
            price: prod.price,
            title: prod.title,
            category: prod.category,
            imageUrl: prod.imageUrl
          },
          quantity: productInCart[0].quantity,
          itemTotalPrice: totalPrice
        }

        itemsArr.push(item);

      });
    }

    let total = 0;

    if(itemsArr.length > 0)
    total = itemsArr.reduce((accumulator, item) => accumulator + item.itemTotalPrice);

    let shoppingCart = new ShoppingCart({
      customer: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      items: itemsArr,
      totalPrice: total
    });
    shoppingCart = await shoppingCart.save();
    res.send(shoppingCart);
  } catch (e) {
    throw new Error(e);
    res.status(500).send('Unexpected error occurred: ', e);
  }
});

// async function addItems(items) {

//   let itemsArr = [];
//   if (items.length > 0){
//     items.forEach(async (item) => {
//       let tempItem = {};

//       const product = await Product.find({_id : item.productId});
//       console.log('product: ', product);
//       if(!product) return res.status(400).send('The product with given ID has not been found');



//       tempItem.product = {
//         _id : product._id,
//         price : product.price,
//         title : product.title,
//         category : product.category,
//         imageUrl : product.imageUrl

//       };
//       console.log('tempItem.product: ', tempItem.product);
//       tempItem.quantity = item.quantity;
//       tempItem.itemTotalPrice = item.quantity * product.price;

//       console.error('tempItem: ',tempItem);
//       itemsArr.push(tempItem);

//     });
//   }

//   return itemsArr;
// }
// router.put('/:id', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) res.status(400).send(error.details[0].message);

//   try {
//     let shoppingCart = await ShoppingCart.findById(req.params.id);
//     if (!shoppingCart)
//       res.status(404).send('The shopping cart with given ID has not been found');

//     shoppingCart.name = req.body.name;
//     shoppingCart = await shoppingCart.save();
//     res.send(shoppingCart);
//   } catch (e) {
//     res.status(500).send('Unexpected error: ', e);
//   }
// });
///:id/:productId
router.patch('/:id', async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let shoppingCart = await ShoppingCart.findById(req.params.id);
    if (!shoppingCart)
      res
        .status(404)
        .send('The shopping cart with given ID has not been found');

    const product = await Product.findById(req.body.productId);
    if (!product)
      res.status(404).send('The product with given ID has not been found');

    const productInCart = shoppingCart.items.filter(
      (item) => item.productId === product._id.toString()
    );

    let item = {};
    if (productInCart.length < 1) {
      item.productId = product._id;
      item.quantity = req.body.quantity;
      item.itemTotalPrice = item.quantity * product.price;
      shoppingCart.items.push(item);
    }

    shoppingCart = await shoppingCart.save();
    res.send(shoppingCart);
  } catch (e) {
    throw new Error(e);
    res.status(500).send('Unexpected error: ', e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let shoppingCart = await ShoppingCart.findByIdAndRemove(req.params.id);
    if (!shoppingCart)
      res.status(404).send('The category with given ID has not been found');

    res.send(shoppingCart);
  } catch (error) {
    res.status(500).send('Unexpected error: ', e);
  }
});

module.exports = router;
