const express = require("express")

const app = express()
app.use(express.json())

const cors = require("cors")

app.use(cors())

const userController = require("./Controllers/user.controller")
const pageController = require("./Controllers/page.controller")
const productController = require("./Controllers/product.controller")
const {
  register,
  login,
  verifyToken,
} = require("./Controllers/auth.controller")
const { uploadUser } = require("./Middlewares/multer")
const instance = require("./Configs/razorpay")

const passport = require("./Configs/passport.google")

const User = require("./Models/user.model")

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))

app.use("/users", userController)
app.post("/register", uploadUser("profilePic"), register)
app.post("/login", login)
app.use("/pages", pageController)
app.use("/products", productController)

app.get("/admin/pages", async (req, res) => {
  try {
    return res.status(200).render("pages.ejs")
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

app.get("/admin/products", async (req, res) => {
  try {
    return res.status(200).render("products.ejs")
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

app.get("/confrimation/:token", async (req, res) => {
  try {
    const user = await verifyToken(req.params.token)

    if (!user) return res.status(402).send({ message: "invalid token" })

    user.user.confirmed = true

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user.user._id,
        user.user,
        {
          new: true,
        }
      )
        .lean()
        .exec()

      redis.get(`User.${user.user._id}`, async (err, fetchedPost) => {
        if (err) console.log(err.message)

        redis.set(`User.${user.user._id}`, JSON.stringify(user.user))

        const users = await User.find().lean().exec()
        redis.set(`User`, JSON.stringify(users))
      })

      res.status(200).render("confirmmail.ejs", {
        updatedUser,
        message: "Verification Sucessfull",
      })
    } catch (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
)

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    res.status(201).send({ user: req.user?.user, token: req.user?.token })
  }
)

app.get("/auth/google/failure", (req, res) => {
  res.send("failure")
})

app.get("/auth/facebook", passport.authenticate("facebook"))

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/")
  }
)

app.post("/razorpay", async (req, res) => {
  
  var options = {
    amount: 500 * 100,
    currency: "INR",
  }
  instance.orders.create(options, function (err, order) {
    console.log(order)
    res.status(200).json(order)
  })
})

module.exports = app
