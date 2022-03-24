const mongoose = require("mongoose")
require("dotenv").config()

const connection = () => {
    return mongoose
      .connect(
        process.env.db
      )
      .then(() => {
        console.log("Connected")
      })
}

module.exports = connection