const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const sortCondition = req.query.sortCondition || 'name_asc'
  const sortConditionSplit = sortCondition.split('_')
  const sortTarget = sortConditionSplit[0] // asc or desc
  const sortSequence = sortConditionSplit[1]
  const userId = req.user._id

  Restaurant.find({ userId })
    .lean()
    .sort({ [sortTarget]: sortSequence }) // desc
    .then(restaurants => res.render('index', { restaurants, sortCondition }))
    .catch(error => console.error(error))
})

module.exports = router
