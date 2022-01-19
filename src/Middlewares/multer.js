var aws = require("aws-sdk")
var multer = require("multer")
var multerS3 = require("multer-s3")

var s3 = new aws.S3({
  accessKeyId: "AKIAUWYRXQS3XITESVY4",
  secretAccessKey: "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",
})

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: "overstock-clone",
    acl: "public-read",
    metadata: function (req, file, cb) {
      console.log("here")
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      console.log(file)
      cb(null, Date.now() + "-" + file.originalname, req.file)
    },
  }),
})


