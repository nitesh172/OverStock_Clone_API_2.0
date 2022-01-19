const {Router} = require("express")
const crudController = require("./crud.controller")
const Page = require("../Models/page.model")
const router = Router()
const upload = require("./Middlewares/multer")

router.post("", async (req, res) => {
  try {
    const page = await Page.create(req.body)

    return res.status(201).send(page)
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})


module.exports = router