const mongoose = require("mongoose")
const validator = require("validator")

const productSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: true,
  },
  img1: {
    type: String,
    required: true,
  },
  img2: {
    type: String,
    required: true,
  },
  img3: {
    type: String,
    required: true,
  },
  img4: {
    type: String,
    required: true,
  },
  img5: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 10,
  },
  rating: {
    type: Number,
    required: true,
  },
  color: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  main_catergory: {
    type: String,
    required: true,
  },
  main_sub_catergory: {
    type: String,
    required: true,
  },
  sub_catergory: {
    type: String,
    required: true,
  },
  catergory: {
    type: String,
    required: true,
  },
})

// we will create a new collection

const Product = new mongoose.model("Product", productSchema)

module.exports = Product
