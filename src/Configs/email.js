const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2
require("dotenv").config()

const oauth2Client = new OAuth2(
  process.env.clientId,
  process.env.clientSecret, // Client Secret
  process.env.redirectURL // Redirect URL
)

oauth2Client.setCredentials({
  refresh_token: process.env.refreshToken,
})

const accessToken = oauth2Client.getAccessToken()

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.user,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken: process.env.refreshToken,
    accessToken: accessToken,
  },
})

module.exports = transport
