const nodemailer = require("nodemailer")

// module.exports = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//         user: 'outstockclone@gmail.com',
//         pass: 'nitesh12'
//     }
// });
module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "922b8289ff17e5",
    pass: "708d4aafd8dd98",
  },
})