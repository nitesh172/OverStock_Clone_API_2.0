const {Router} = require("express")
const crudController = require("./crud.controller")
const Page = require("../Models/page.model")
const router = Router()

router.get("", crudController(Page).get)


module.exports = router