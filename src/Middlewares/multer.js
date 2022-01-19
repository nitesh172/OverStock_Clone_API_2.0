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
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
    },
  }),
})

// const { google } = require("googleapis")
// const multer = require("multer")
// const path = require("path")
// const fs = require("fs")

// const OAuth2 = google.auth.OAuth2

// const oauth2Client = new OAuth2(
//   "280625541145-vm633gtro3p4ma9vta76je3gnmquk244.apps.googleusercontent.com",
//   "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", // Client Secret
//   "https://developers.google.com/oauthplayground" // Redirect URL
// )

// oauth2Client.setCredentials({
//   refresh_token:
//     "1//04vADvKoBdD3BCgYIARAAGAQSNwF-L9IrDXoeiJrnCgHhcc8ULWgXulig9flal2FQdA64K3zYQMsQmHQrOTvBoFPw0wKzOQUrQ64",
// })

// const accessToken = oauth2Client.getAccessToken()

// const drive = google.drive({
//   version: "v3",
//   auth: oauth2Client,
// })
// // const filePath = path.join(__dirname, "../uploads/badge.png")

// const uploadImg = async (filePath, filename) => {
//     try {
//         const response = await drive.files.create({
//           requestBody: {
//             name: filename,
//             mimeType: "image/png" || "image/jpeg",
//           },
//           media: {
//             mimeType: "image/png" || "image/jpeg",
//             body: fs.createReadStream(filePath)
//           },
//         })
//         console.log(response.data)

//         const fileId = response.data.id

//         await drive.permissions.create({
//             fileId: fileId,
//             requestBody: {
//                 role: 'reader',
//                 type: 'anyone'
//             }
//         })

//         const result = `https://drive.google.com/thumbnail?id=${response.data.id}`

//         console.log(result)
//         return result
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../uploads"))
//   },
//   filename: function (req, file, cb) {
//       const filename = Date.now() + "-" + file.originalname
//       uploadImg(path.join(__dirname, `../uploads/${filename}`), filename)
//     cb(null, filename)
//   },
// })

// function fileFilter(req, file, cb) {
//   if (file.mimeType === "image/png" || file.mimeType === "image/jpeg") {
//     cb(null, true)
//   } else {
//     cb(null, false)
//   }
// }

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// })

// module.exports = upload
