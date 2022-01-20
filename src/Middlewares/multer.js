var aws = require("aws-sdk")
var multer = require("multer")
var multerS3 = require("multer-s3")

var s3 = new aws.S3({
  accessKeyId: "AKIAUWYRXQS3XITESVY4",
  secretAccessKey: "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",
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "overstock-clone",
    acl: "public-read",
    metadata: function (req, file, cb) {
      console.log("here")
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
    },
  }),
})


const uploadUser = (fieldName) => {
  return (req, res, next) => {
      const createUserFun = upload.single(fieldName);

      createUserFun(req, res, function (err) {
          if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              res.send({ message: err.message, errorType: "MulterError" });
          } else if (err) {
              // An unknown error occurred when uploading.
              res.send({ message: err.message, errorType: "NormalError" });
          }
          // Everything went fine.
          next();
      });
  };
};

const uploadUsers = (fieldName) => {
  return (req, res, next) => {
      const createUserFun = upload.array(fieldName);

      createUserFun(req, res, function (err) {
          if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              res.send({ message: err.message, errorType: "MulterError" });
          } else if (err) {
              // An unknown error occurred when uploading.
              res.send({ message: err.message, errorType: "NormalError" });
          }
          // Everything went fine.
          next();
      });
  };
};

const fieldWise = () => {
  return (req, res, next) => {
    const createUserFun = upload.fields([{name: "file1"}, {name: "file2"}])

    createUserFun(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.send({ message: err.message, errorType: "MulterError" })
      } else if (err) {
        // An unknown error occurred when uploading.
        res.send({ message: err.message, errorType: "NormalError" })
      }
      // Everything went fine.
      next()
    })
  }
}

module.exports = {uploadUser,uploadUsers, fieldWise};