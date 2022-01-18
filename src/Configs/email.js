const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'outstockclone@gmail.com',
        pass: 'nitesh12'
    }
});
