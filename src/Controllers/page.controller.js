const {Router} = require("express")
const crudController = require("./crud.controller")
const Page = require("../Models/page.model")
const router = Router()

router.get("", async (req, res) => {
    res.status(200).render("pages")
})


module.exports = router