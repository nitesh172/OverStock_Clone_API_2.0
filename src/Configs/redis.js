const redis = require("redis")
require('dotenv').config()

const client = redis.createClient({
  url: process.env.REDIS_URL,
})

client.on("connect", (err) => {
  if (err) console.log(err.message)
  console.log("Connected!")
})

module.exports = client
