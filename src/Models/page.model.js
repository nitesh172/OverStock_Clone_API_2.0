const mongoose = require("mongoose")

const pageSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
  },
  imgURL: {
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
  text1: {
    type: String,
    required: true,
  },
  text2: {
    type: String,
    required: true,
  },
  text3: {
    type: String,
    required: true,
  },
  text4: {
    type: String,
    required: true,
  },
  catergory: {
    type: Array,
    required: true,
  },
  imb1: {
    type: Object,
    required: true,
    imgUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  imb2: {
    type: Object,
    required: true,
    imgUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  moreCategory: {
    type: Array,
    required: true,
  },
})

// we will create a new collection

const Page = new mongoose.model("Page", pageSchema)

module.exports = Page