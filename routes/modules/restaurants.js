const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const sortCondition = req.query.sortCondition || 'name_asc'
  const sortConditionSplit = sortCondition.split('_')
  const sortTarget = sortConditionSplit[0] // asc or desc
  const sortSequence = sortConditionSplit[1]

  if (keyword.trim() === '') {
    res.redirect(`/?sortCondition=${sortCondition}`)
  } else {
    return Restaurant.find({ name: { $regex: `${keyword}`, $options: '$i' } })
      .lean()
      .sort({ [sortTarget]: sortSequence })
      .then(restaurants => res.render('index', { restaurants, keyword, sortCondition }))
  }
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/new', (req, res) => {
  const userId = req.user._id
  const newRestaurant = req.body
  return Restaurant.create({ ...newRestaurant, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 導到詳細頁
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})
// 導到編輯頁
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// 更新餐廳詳細資料
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(Restaurant => Restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
