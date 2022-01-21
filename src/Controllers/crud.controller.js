const redis = require("../Configs/redis")

const get = (model) => async (req, res) => {
  try {
    console.log("hello Rahul Mai edher hu",model)
    redis.get(`${model}`, async (err, value) => {
      if (err) console.log(err.message)

      if (value) {
        value = JSON.parse(value)
        res.status(201).send({ value, redis: true })
      } else {
        try {
          const value = await model.find().lean().exec()
          redis.set(`${model}`, JSON.stringify(value))
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

const getOne = (model) => async (req, res) => {
  try {
    const id = req.params.id
    redis.get(`${model}.${id}`, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        return res.status(201).send({ value, redis: true })
      } else {
        try {
          const value = await model.findById(id).lean().exec()
          redis.set(`${model}.${id}`, JSON.stringify(value))
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

const post = (model) => async (req, res) => {
  try {
    const item = await model.create(req.body)
    redis.get(`${model}`, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        redis.set(`${model}`, JSON.stringify([...value, item]))
      } else {
        value = await model.find().lean().exec()
        redis.set(`${model}`, JSON.stringify(value))
      }
    })
    return res.status(201).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const patch = (model) => async (req, res) => {
  try {
    const id = req.params.id
    const item = await model
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .lean()
      .exec()
    redis.get(`${model}.${id}`, async (err, fetchedPost) => {
      if (err) console.log(err.message)

      redis.set(`${model}.${id}`, JSON.stringify(item))

      const items = await model.find().lean().exec()
      redis.set(`${model}`, JSON.stringify(items))
    })
    res.status(201).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const deleteOne = (model) => async (req, res) => {
  try {
    const id = req.params.id
    const item = await model.findByIdAndDelete(id).lean().exec()
    res.status(201).send(post)
    redis.get(`${model}`, async (err, fetchedPost) => {
      if (err) console.log(err)
      redis.del(`${model}.${id}`)

      const items = await Post.find().lean().exec()
      redis.set(`${model}`, JSON.stringify(items))
    })
    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

module.exports = (model) => ({
  get: get(model),
  getOne: getOne(model),
  post: post(model),
  patch: patch(model),
  deleteOne: deleteOne(model),
})
