const mongoose = require("mongoose")

const connection = () => {
    return mongoose
      .connect(
        "mongodb+srv://nitesh172:overstock12@cluster0.2pflp.mongodb.net/overstockapi"
      )
      .then(() => {
        console.log("Connected")
      })
}

module.exports = connection