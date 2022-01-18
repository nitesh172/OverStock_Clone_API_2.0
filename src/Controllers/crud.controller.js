const get = (model, populate) => async (req, res) => {
  try {
    const items = await model.find().populate(populate).lean().exec()

    return res.status(200).send(items)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const getOne = (model, populate) => async (req, res) => {
  try {
    const item = await model
      .findOne(req.params.id)
      .populate(populate)
      .lean()
      .exec()

    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const post = (model) => async (req, res) => {
  try {
    const item = await model.create(req.body)

    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const postMany = (model) => async (req, res) => {
  try {
    const items = await model.insertMany(req.body)

    return res.status(200).send(items)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const patch = (model, populate) => async (req, res) => {
  try {
    const item = await model
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .populate(populate)
      .lean()
      .exec()

    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const deleteOne = (model) => async (req, res) => {
  try {
    const item = await model.findByIdAndDelete(req.params.id).lean().exec()

    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const deleteMany = (model) => async (req, res) => {
  try {
    const item = await model.deleteMany(req.params.id).lean().exec()

    return res.status(200).send(item)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

module.exports = (model, populate = null) => ({
  get: get(model, populate),
  getOne: getOne(model, populate),
  post: post(model),
  postMany: postMany(model),
  patch: patch(model, populate),
  deleteOne: deleteOne(model),
  deleteMany: deleteMany(model),
})
