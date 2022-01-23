const { Router } = require("express")
const redis = require("../Configs/redis")
const router = Router()

router.post("", (req, res) => {
  try {
      console.log("hello rahul", req.body)
    redis.set(req.body.email, req.body.data)
    return res.status(201).send({ message: "data updated" })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

router.get("", (req, res) => {
  try {
    redis.get(req.body.email, async (err, value) => {
      if (err) console.log(err.message)
    //   value = JSON.parse(value)
      return res.status(200).send(value)
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
