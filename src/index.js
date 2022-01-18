const express = require("express")
const ejs = require("ejs")

const app = express()
const userController = require("./Controllers/user.controller")

app.use(express.json())

const passport = require("./Configs/passport.google")
const userContoller = require("./Controllers/user.controller")
const {
  register,
  login,
  verifyToken,
} = require("./Controllers/auth.controller")
const User = require("./Models/user.model")

app.use(express.json())
app.set("view engine", ejs)

app.use("/users", userContoller)
app.post("/register", register)
app.post("/login", login)
app.get("/confrimation/:token", async (req, res) => {
  try {
    const user = await verifyToken(req.params.token)

    if (!user) return res.status(402).send({ message: "invalid token" })

    user.user.confirmed = true

    console.log(user)

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

      res
        .status(200)
        .render("confirmmail.ejs", {
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

module.exports = app
