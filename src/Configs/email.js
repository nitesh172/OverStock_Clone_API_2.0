const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  "280625541145-vm633gtro3p4ma9vta76je3gnmquk244.apps.googleusercontent.com",
  "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", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
)

oauth2Client.setCredentials({
  refresh_token:
    "1//04w-XWmNFWJs1CgYIARAAGAQSNwF-L9IrZfpsgwTRpmV0_7vPx_jmf7pZJ2yUvpZEHI1x-yOcUt4SO5sJ9AAq9L9nT70kGkkw0Mo",
})

const accessToken = oauth2Client.getAccessToken()




const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "outstockclone@gmail.com",
    clientId:
      "280625541145-vm633gtro3p4ma9vta76je3gnmquk244.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04w-XWmNFWJs1CgYIARAAGAQSNwF-L9IrZfpsgwTRpmV0_7vPx_jmf7pZJ2yUvpZEHI1x-yOcUt4SO5sJ9AAq9L9nT70kGkkw0Mo",
    accessToken: accessToken,
  },
})

module.exports = transport