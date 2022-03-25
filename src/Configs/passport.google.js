const GoogleStrategy = require("passport-google-oauth2").Strategy
const passport = require("passport")
const { newToken } = require("../Controllers/auth.controller")
const FacebookStrategy = require("passport-facebook").Strategy
const User = require("../Models/user.model")
const { v4: uuidv4 } = require("uuid")
const redis = require("./redis")
require("dotenv").config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
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

      redis.get(`User`, async (err, value) => {
        if (err) console.log(err)

        if (value) {
          value = JSON.parse(value)
          redis.set(`User`, JSON.stringify([...value, user]))
        } else {
          value = await model.find().lean().exec()
          redis.set(`User`, JSON.stringify(value))
        }
      })

      const token = newToken(user)
      console.log({ token, user })
      return done(null, { token, user })
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: "1427100647747999",
      clientSecret: "cfa10310de6c77244bad91dad542a5c7",
      callbackURL: "https://overstock-2.herokuapp.com/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
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
      console.log({ token, user })
      return done(null, { token, user })
    }
  )
)

module.exports = passport
