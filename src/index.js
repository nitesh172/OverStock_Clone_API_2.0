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
    const imgFolder = req.files
    // const category = [
    //   {
    //     name: req.body.c1,
    //     imgUrl: imgFolder.c1img[0].location,
    //   },
    //   {
    //     name: req.body.c2,
    //     imgUrl: imgFolder.c2img[0].location,
    //   },
    //   {
    //     name: req.body.c3,
    //     imgUrl: imgFolder.c3img[0].location,
    //   },
    //   {
    //     name: req.body.c4,
    //     imgUrl: imgFolder.c4img[0].location,
    //   },
    //   {
    //     name: req.body.c5,
    //     imgUrl: imgFolder.c5img[0].location,
    //   },
    //   {
    //     name: req.body.c6,
    //     imgUrl: imgFolder.c6img[0].location,
    //   },
    //   {
    //     name: req.body.c7,
    //     imgUrl: imgFolder.c7img[0].location,
    //   },
    //   {
    //     name: req.body.c8,
    //     imgUrl: imgFolder.c8img[0].location,
    //   },
    //   {
    //     name: req.body.c9,
    //     imgUrl: imgFolder.c9img[0].location,
    //   },
    //   {
    //     name: req.body.c10,
    //     imgUrl: imgFolder.c10img[0].location,
    //   },
    //   {
    //     name: req.body.c11,
    //     imgUrl: imgFolder.c11img[0].location,
    //   },
    //   {
    //     name: req.body.c12,
    //     imgUrl: imgFolder.c12img[0].location,
    //   },
    // ]

    // const moreCategory = [
    //   {
    //     name: req.body.c1n,
    //     imgUrl: imgFolder.c1nimg[0].location,
    //   },
    //   {
    //     name: req.body.c2n,
    //     imgUrl: imgFolder.c2nimg[0].location,
    //   },
    //   {
    //     name: req.body.c3n,
    //     imgUrl: imgFolder.c3nimg[0].location,
    //   },
    //   {
    //     name: req.body.c4n,
    //     imgUrl: imgFolder.c4nimg[0].location,
    //   },
    //   {
    //     name: req.body.c5n,
    //     imgUrl: imgFolder.c5nimg[0].location,
    //   },
    //   {
    //     name: req.body.c6n,
    //     imgUrl: imgFolder.c6nimg[0].location,
    //   },
    //   {
    //     name: req.body.c7n,
    //     imgUrl: imgFolder.c7nimg[0].location,
    //   },
    //   {
    //     name: req.body.c8n,
    //     imgUrl: imgFolder.c8nimg[0].location,
    //   },
    //   {
    //     name: req.body.c9n,
    //     imgUrl: imgFolder.c9nimg[0].location,
    //   },
    //   {
    //     name: req.body.c10n,
    //     imgUrl: imgFolder.c10nimg[0].location,
    //   },
    //   {
    //     name: req.body.c11n,
    //     imgUrl: imgFolder.c11nimg[0].location,
    //   },
    //   {
    //     name: req.body.c12n,
    //     imgUrl: imgFolder.c12nimg[0].location,
    //   },
    // ]
    const page = await Page.create({
      pageName: req.body.pageName,
      imgUrl: imgFolder.imgUrl[0].location,
      img1: imgFolder.img1[0].location,
      img2: imgFolder.img2[0].location,
      // text1: req.body.text1,
      // text2: req.body.text2,
      // text3: req.body.text3,
      // text4: req.body.text4,
      // category: category,
      // imb1: {
      //   imgUrl: imgFolder.imbImg1[0].location,
      //   title: req.body.imgbt1,
      //   desc: req.body.desc1,
      // },
      // imb2: {
      //   imgUrl: imgFolder.imbImg2[0].location,
      //   title: req.body.imgbt2,
      //   desc: req.body.desc2,
      // },
      // moreCategory: moreCategory,
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