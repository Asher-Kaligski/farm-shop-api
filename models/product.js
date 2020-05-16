const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({

    category: { type: String, required: true },
    imageUrl: String,
    price: { type: Number, required: true },
    title: { type: String, required: true }
});