const {Router} = require("express")

const router = Router()
const crudController = require("./crud.controller")
const Product = require("../Models/product.model")

router.get("", crudController(Product).get)
router.post("", async (req, res) => {
    try {
        const products = await Product.create({
          ...req.body,
          imgURL: req.files.imgURL[0].location,
          img1: req.files.img1[0].location,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

module.exports = router