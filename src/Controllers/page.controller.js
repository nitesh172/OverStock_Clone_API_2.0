// This is page controller of our project..
const { Router } = require("express")
const crudController = require("./crud.controller")
const Page = require("../Models/page.model")
const router = Router()
const { fieldWise } = require("../Middlewares/multer")
const redis = require("../Configs/redis")

router.get("", crudController(Page, "Page").get)
router.get("/:name", async (req, res) => {
  try {
    const pageName = req.params.name
    redis.get(pageName, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        return res.status(201).send(value)
      } else {
        try {
          const value = await Page.findOne({pageName}).lean().exec()
          redis.set(pageName, JSON.stringify(value))
          res.status(201).send(value)
        } catch (err) {
          res.status(201).send(err.message)
        }
      }
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

function CreateObject(name, imgUrl) {
  return {
    name,
    imgUrl,
  }
}

const arr = []

for (let i = 1; i <= 12; i++) {
  arr.push({ name: `c${i}img` })
  arr.push({ name: `c${i}nimg` })
}

arr.push({ name: "imgUrl" })
arr.push({ name: "img1" })
arr.push({ name: "img2" })
arr.push({ name: "imbImg1" })
arr.push({ name: "imbImg2" })

router.post("/create", fieldWise(arr), async (req, res) => {
  try {
    const imgFolder = req.files
    let category = []
    let moreCategory = []
    for (let i = 1; i <= 12; i++) {
      let a = "req.body.c" + i
      let b = "imgFolder.c" + i + "img[0].location"
      let c = "req.body.c" + i + "n"
      let d = "imgFolder.c" + i + "nimg[0].location"
      a = eval(a)
      b = eval(b)
      c = eval(c)
      d = eval(d)
      category.push(CreateObject(a, b))
      moreCategory.push(CreateObject(c, d))
    }

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

    redis.get("Page", async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        redis.set("Page", JSON.stringify([...value, page]))
      } else {
        value = await model.find().lean().exec()
        redis.set("Page", JSON.stringify(value))
      }
    })

    return res.status(201).send(page)
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

module.exports = router
