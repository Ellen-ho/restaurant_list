const express = require('express')
const router = express.Router()
const passport = require('passport')

// 使用者按按鈕觸發
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook',
  {
    successRedirect: '/',
    failureRedirect: 'users/login'
  }))

module.exports = router
