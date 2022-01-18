const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "null",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: false,
      default: "https://i.postimg.cc/MTw0t80t/pngegg-1.png",
    },
    confirmed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
)


userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next()
  this.password = bcrypt.hashSync(this.password, 8);
  return next()
})



module.exports = mongoose.model("user", userSchema)
