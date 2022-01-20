var aws = require("aws-sdk")
var multer = require("multer")
var multerS3 = require("multer-s3")

var s3 = new aws.S3({
  accessKeyId: "AKIAUWYRXQS373SOJWOH",
  secretAccessKey: "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",
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "overstock-clone",
    acl: "public-read",
    metadata: function (req, file, cb) {
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
    const createUserFun = upload.fields([
      { name: "imgUrl" },
      { name: "img1" },
      { name: "img2" },
      { name: "c1img" },
      { name: "c2img" },
      { name: "c3img" },
      { name: "c4img" },
      { name: "c5img" },
      { name: "c6img" },
      { name: "c7img" },
      { name: "c8img" },
      { name: "c9img" },
      { name: "c10img" },
      { name: "c11img" },
      { name: "c12img" },
      { name: "imbImg1" },
      { name: "imbImg2" },
      { name: "c1nimg" },
      { name: "c2nimg" },
      { name: "c3nimg" },
      { name: "c4nimg" },
      { name: "c5nimg" },
      { name: "c6nimg" },
      { name: "c7nimg" },
      { name: "c8nimg" },
      { name: "c9nimg" },
      { name: "c10nimg" },
      { name: "c11nimg" },
      { name: "c12nimg" },
    ])

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