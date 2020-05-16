const mongoose = require('mongoose');




 const orderSchema = new mongoose.Schema({

     datePlaced: new Date(),
     items: []


 });