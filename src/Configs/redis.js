const redis = require("redis")

const client = redis.createClient({
  url: "redis://:pb49d893ace8e1170760bb42906296033935cf5b3a318821179783b7aa4daf374@ec2-3-224-115-109.compute-1.amazonaws.com:9979",
})

client.on("connect", (err) => {
  if (err) console.log(err.message)
  console.log("Connected!")
})

module.exports = client
