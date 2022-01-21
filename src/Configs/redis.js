const redis = require("redis")

const client = redis.createClient()

client.on("connect", (err) => {
  if (err) console.log(err.message)
  console.log("Connected!")
})

module.exports = client
