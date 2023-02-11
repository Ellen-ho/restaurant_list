const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = app => {
  // 初始化Passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        // done 函數是完成驗證後返回的結果，三個參數是指
        // 1. error: 驗證過程中的錯誤，沒有就回傳 null
        // 2. user: 驗證成功後返回的訊息，失敗就回傳 false
        // 3. info: 回傳驗證錯誤提示
        if (!user) {
          return done(null, false, req.flash('warning_msg', '此信箱尚未註冊!'))
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, req.flash('warning_msg', '信箱或密碼錯誤!'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // 將 user ID 存到 session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  // 將 user ID 從 session 中取出並從 DB 中取出 user 資訊
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
