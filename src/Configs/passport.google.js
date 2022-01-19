const GoogleStrategy = require("passport-google-oauth2").Strategy
const passport = require("passport")

const { newToken } = require("../Controllers/auth.controller")
const User = require("../Models/user.model")
const { v4: uuidv4 } = require("uuid")

passport.use(
  new GoogleStrategy(
    {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://overstock-2.herokuapp.com/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ email: profile?._json?.email })
      if (!user) {
        user = await User.create({
          name: profile?._json?.name,
          email: profile?._json?.email,
          password: uuidv4(),
          confirmed: true,
          profilePic: profile?._json?.picture,
        })
      }

      const token = newToken(user)

      return done(null, { token, user })
    }
  )
)

module.exports = passport
