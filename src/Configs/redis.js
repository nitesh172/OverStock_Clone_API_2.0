const redis = require("redis")

const client = redis.createClient({
  url: "redis://:p0d30b28d691d0e6b5ec4becce262f950128f5a9317cda76f673b3331c858ac7d@ec2-3-213-154-214.compute-1.amazonaws.com:18509",
})

client.on("connect", (err) => {
  if (err) console.log(err.message)
  console.log("Connected!")
})

module.exports = client
