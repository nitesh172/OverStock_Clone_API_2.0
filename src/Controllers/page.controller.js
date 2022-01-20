const { Router } = require("express")
const crudController = require("./crud.controller")
const Page = require("../Models/page.model")
const router = Router()
const { fieldWise } = require("./Middlewares/multer")
const Page = require("./Models/page.model")

router.post("/create", fieldWise(), async (req, res) => {
  try {
    const imgFolder = req.files
    const category = [
      {
        name: req.body.c1,
        imgUrl: imgFolder.c1img[0].location,
      },
      {
        name: req.body.c2,
        imgUrl: imgFolder.c2img[0].location,
      },
      {
        name: req.body.c3,
        imgUrl: imgFolder.c3img[0].location,
      },
      {
        name: req.body.c4,
        imgUrl: imgFolder.c4img[0].location,
      },
      {
        name: req.body.c5,
        imgUrl: imgFolder.c5img[0].location,
      },
      {
        name: req.body.c6,
        imgUrl: imgFolder.c6img[0].location,
      },
      {
        name: req.body.c7,
        imgUrl: imgFolder.c7img[0].location,
      },
      {
        name: req.body.c8,
        imgUrl: imgFolder.c8img[0].location,
      },
      {
        name: req.body.c9,
        imgUrl: imgFolder.c9img[0].location,
      },
      {
        name: req.body.c10,
        imgUrl: imgFolder.c10img[0].location,
      },
      {
        name: req.body.c11,
        imgUrl: imgFolder.c11img[0].location,
      },
      {
        name: req.body.c12,
        imgUrl: imgFolder.c12img[0].location,
      },
    ]

    const moreCategory = [
      {
        name: req.body.c1n,
        imgUrl: imgFolder.c1nimg[0].location,
      },
      {
        name: req.body.c2n,
        imgUrl: imgFolder.c2nimg[0].location,
      },
      {
        name: req.body.c3n,
        imgUrl: imgFolder.c3nimg[0].location,
      },
      {
        name: req.body.c4n,
        imgUrl: imgFolder.c4nimg[0].location,
      },
      {
        name: req.body.c5n,
        imgUrl: imgFolder.c5nimg[0].location,
      },
      {
        name: req.body.c6n,
        imgUrl: imgFolder.c6nimg[0].location,
      },
      {
        name: req.body.c7n,
        imgUrl: imgFolder.c7nimg[0].location,
      },
      {
        name: req.body.c8n,
        imgUrl: imgFolder.c8nimg[0].location,
      },
      {
        name: req.body.c9n,
        imgUrl: imgFolder.c9nimg[0].location,
      },
      {
        name: req.body.c10n,
        imgUrl: imgFolder.c10nimg[0].location,
      },
      {
        name: req.body.c11n,
        imgUrl: imgFolder.c11nimg[0].location,
      },
      {
        name: req.body.c12n,
        imgUrl: imgFolder.c12nimg[0].location,
      },
    ]
    const page = await Page.create({
      pageName: req.body.pageName,
      imgUrl: imgFolder.imgUrl[0].location,
      img1: imgFolder.img1[0].location,
      img2: imgFolder.img2[0].location,
      text1: req.body.text1,
      text2: req.body.text2,
      text3: req.body.text3,
      text4: req.body.text4,
      category: category,
      imb1: {
        imgUrl: imgFolder.imbImg1[0].location,
        title: req.body.imgbt1,
        desc: req.body.desc1,
      },
      imb2: {
        imgUrl: imgFolder.imbImg2[0].location,
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

module.exports = router
