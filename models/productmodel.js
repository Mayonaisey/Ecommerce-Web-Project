const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: false },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  size: { type: String, required: true },
  gender: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Product = mongoose.model('Productmodel', productSchema);

module.exports = Product;
