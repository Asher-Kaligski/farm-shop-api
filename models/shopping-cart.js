const mongoose = require('mongoose');
const Joi = require('@hapi/joi');



///if the user loggin store the shopping-cart in the DB if not store it in the localStorage and after login store in the DB

  

 const shoppingCartSchema = new mongoose.Schema({

    dateCreated: Date.now,
    items: []

 });