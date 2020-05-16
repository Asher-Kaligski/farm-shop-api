const mongoose = require('mongoose');


  

 const shoppingCartSchema = new mongoose.Schema({

    dateCreated: new Date(),
    items: []

 });