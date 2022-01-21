const User = require("../Models/user.model")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const redis = require("../Configs/redis")

const newToken = (user) => {
  return jwt.sign(
    { user: user },
    "gsfgsfgduskjghskjhgsduagseuiwahgwiesuytuiyshwtuwyuwhnfiow"
  )
}

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      "gsfgsfgduskjghskjhgsduagseuiwahgwiesuytuiyshwtuwyuwhnfiow",
      function (err, decoded) {
        if (err) return reject(err)
        resolve(decoded)
      }
    )
  })
}

const transporter = require("../Configs/email")

const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let user = await User.findOne({ email: req.body.email }).lean().exec()

    if (user) return res.status(401).send({ message: "User already Exists" })

    user = await User.create({
      ...req.body,
      profilePic: req.file?.location,
    })

    const token = newToken(user)

    const url = `https://overstock-2.herokuapp.com/confrimation/${token}`

    const mailOptions = {
      from: "outstockclone@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: "Confirm your gmail", // Subject line
      html: `<h1> Confrim Mail</h1> <br> <a href="${url}" target="_blank" alt=""><button>Click Here</button></a>`, // plain text body
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err)
      else console.log(info)
    })

    redis.get(`User`, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        redis.set(`User`, JSON.stringify([...value, user]))
      } else {
        value = await model.find().lean().exec()
        redis.set(`User`, JSON.stringify(value))
      }
    })

    return res
      .status(201)
      .send({ user, token, message: "Registration sucessfull" })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let user = await User.findOne({ email: req.body.email }).lean().exec()

    if (!user) return res.status(401).send({ message: "User not Found" })

    const match = bcrypt.compareSync(req.body.password, user.password)

    if (!match) return res.status(401).send({ message: "Password Invalid" })

    if (!user.confirmed)
      return res.status(401).send({ message: "First verify your Email" })

    const token = newToken(user)

    return res.status(201).send({ user, token, message: "Login sucessfull" })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

module.exports = { register, login, verifyToken, newToken }
