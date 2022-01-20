const express = require("express")

const app = express()
app.use(express.json())

const cors = require("cors")

app.use(cors())

const userController = require("./Controllers/user.controller")
const {register, login, verifyToken } = require("./Controllers/auth.controller")
const {uploadUser, uploadUsers, fieldWise} = require("./Middlewares/multer")
const Page = require("./Models/page.model")

const passport = require("./Configs/passport.google")

const User = require("./Models/user.model")

app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))

app.use("/users", userController)
app.post("/register", uploadUser("profilePic"), register)
app.post("/login", login)

app.post("/pages/create", fieldWise(), async (req, res) => {
  try {
    console.log(req.file)
    console.log(req.files)
    const category = [
      {
        name: req.body.c1,
        imgUrl: req.files.c1img.location,
      },
      {
        name: req.body.c2,
        imgUrl: req.files.c2img.location,
      },
      {
        name: req.body.c3,
        imgUrl: req.files.c3img.location,
      },
      {
        name: req.body.c4,
        imgUrl: req.files.c4img.location,
      },
      {
        name: req.body.c5,
        imgUrl: req.files.c5img.location,
      },
      {
        name: req.body.c6,
        imgUrl: req.files.c6img.location,
      },
      {
        name: req.body.c7,
        imgUrl: req.files.c7img.location,
      },
      {
        name: req.body.c8,
        imgUrl: req.files.c8img.location,
      },
      {
        name: req.body.c9,
        imgUrl: req.files.c9img.location,
      },
      {
        name: req.body.c10,
        imgUrl: req.files.c10img.location,
      },
      {
        name: req.body.c11,
        imgUrl: req.files.c11img.location,
      },
      {
        name: req.body.c12,
        imgUrl: req.files.c12img.location,
      },
    ]

    const moreCategory = [
      {
        name: req.body.c1n,
        imgUrl: req.files.c1nimg.location,
      },
      {
        name: req.body.c2n,
        imgUrl: req.files.c2nimg.location,
      },
      {
        name: req.body.c3n,
        imgUrl: req.files.c3nimg.location,
      },
      {
        name: req.body.c4n,
        imgUrl: req.files.c4nimg.location,
      },
      {
        name: req.body.c5n,
        imgUrl: req.files.c5nimg.location,
      },
      {
        name: req.body.c6n,
        imgUrl: req.files.c6nimg.location,
      },
      {
        name: req.body.c7n,
        imgUrl: req.files.c7nimg.location,
      },
      {
        name: req.body.c8n,
        imgUrl: req.files.c8nimg.location,
      },
      {
        name: req.body.c9n,
        imgUrl: req.files.c9nimg.location,
      },
      {
        name: req.body.c10n,
        imgUrl: req.files.c10nimg.location,
      },
      {
        name: req.body.c11n,
        imgUrl: req.files.c11nimg.location,
      },
      {
        name: req.body.c12n,
        imgUrl: req.files.c12nimg.location,
      },
    ]

    const page = await Page.create({
      pageName: req.body.pageName,
      imgUrl: req.files.imgUrl.location,
      img1: req.files.img1.location,
      img2: req.files.img2.location,
      text1: req.body.text1,
      text2: req.body.text2,
      text3: req.body.text3,
      text4: req.body.text4,
      category: category,
      imb1: {
        imgUrl: req.files.imbImg1.location,
        title: req.body.imgbt1,
        desc: req.body.desc1,
      },
      imb2: {
        imgUrl: req.files.imbImg2.location,
        title: req.body.imgbt2,
        desc: req.body.desc2,
      },
      moreCategory: moreCategory,
    })

    return res.status(201).send(page)
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

app.get("/admin", async (req, res)  => {
  try {
    return res.status(200).render("pages.ejs")
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

// app.post("/upload", fieldWise(), (req, res) => {
//   try {
//     const items = req.files.file1.location
//     res.send(items)
//   } catch (error) {
//     res.send(error.message)
//     console.log(error.message)
//   }
// })

module.exports = app