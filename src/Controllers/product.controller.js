// This is product controller of our project..
const { Router } = require("express")

const router = Router()
const crudController = require("./crud.controller")
const Product = require("../Models/product.model")
const { fieldWise } = require("../Middlewares/multer")
const redis = require("../Configs/redis")


router.get("", crudController(Product, "Product").get)
router.get("/mainSubCategory=:name", async (req, res) => {
  try {
    const mainSubCategory = req.params.name
    redis.get(mainSubCategory, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        return res.status(201).send(value)
      } else {
        try {
          const value = await Product.find({
            main_sub_catergory: mainSubCategory,
          })
            .lean()
            .exec()
          redis.set(mainSubCategory, JSON.stringify(value))
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

let arr = []

for (var i = 1; i <= 5; i++) {
    arr.push({ name: `img${i}` })
}

arr.push({name: "imgURL"})
arr.push({ name: "color1Img" })
arr.push({ name: "color2Img" })


router.post("",fieldWise(arr), async (req, res) => {
  try {
    const products = await Product.create({
      ...req.body,
      imgURL: req.files.imgURL[0].location,
      img1: req.files.img1[0].location,
      img2: req.files.img2[0].location,
      img3: req.files.img3[0].location,
      img4: req.files.img4[0].location,
      img5: req.files.img5[0].location,
      color: [
        {
          name: req.body.color1Name,
          imgUrl: req.files.color1Img,
        },
        {
          name: req.body.color2Name,
          imgUrl: req.files.color2Img,
        },
      ],
    })

    redis.get("Product", async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        redis.set("Product", JSON.stringify([...value, products]))
      } else {
        value = await model.find().lean().exec()
        redis.set("Product", JSON.stringify(value))
      }
    })

    res.status(201).send(products)
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

module.exports = router
