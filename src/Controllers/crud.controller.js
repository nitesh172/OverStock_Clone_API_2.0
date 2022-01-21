const redis = require("../Configs/redis")

const get = (model, key) => async (req, res) => {
  try {
    redis.get(key, async (err, value) => {
      if (err) console.log(err.message)

      if (value) {
        value = JSON.parse(value)
        res.status(201).send({ value, redis: true })
      } else {
        try {
          const value = await model.find().lean().exec()
          redis.set(key, JSON.stringify(value))
          return res.status(200).send({ value, redis: false })
        } catch (err) {
          res.status(500).send(err.message)
        }
      }
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const getOne = (model, key) => async (req, res) => {
  try {
    const id = req.params.id
    redis.get(key.id, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        return res.status(201).send({ value, redis: true })
      } else {
        try {
          const value = await model.findById(id).lean().exec()
          redis.set(key.id, JSON.stringify(value))
          res.status(201).send({ value, redis: false })
        } catch (err) {
          res.status(201).send(err.message)
        }
      }
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const post = (model, key) => async (req, res) => {
  try {
    const item = await model.create(req.body)
    redis.get(key, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        redis.set(key, JSON.stringify([...value, item]))
      } else {
        value = await model.find().lean().exec()
        redis.set(key, JSON.stringify(value))
      }
    })
    return res.status(201).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const patch = (model, key) => async (req, res) => {
  try {
    const id = req.params.id
    const item = await model
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .lean()
      .exec()
    redis.get(key.id, async (err, fetchedPost) => {
      if (err) console.log(err.message)

      redis.set(key.id, JSON.stringify(item))

      const items = await model.find().lean().exec()
      redis.set(key, JSON.stringify(items))
    })
    res.status(201).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const deleteOne = (model, key) => async (req, res) => {
  try {
    const id = req.params.id
    const item = await model.findByIdAndDelete(id).lean().exec()
    res.status(201).send(post)
    redis.get(key, async (err, fetchedPost) => {
      if (err) console.log(err)
      redis.del(key.id)

      const items = await Post.find().lean().exec()
      redis.set(key, JSON.stringify(items))
    })
    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

module.exports = (model, key) => ({
  get: get(model, key),
  getOne: getOne(model, key),
  post: post(model, key),
  patch: patch(model, key),
  deleteOne: deleteOne(model, key),
})
