const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/search', (req, res) => {
  const keyword = req.query.keyword

  if (keyword.trim() === '' ) {
    res.redirect('/')
  } else {
    return Restaurant.find({
      "$or": [
        { "name": { $regex: `${keyword}`, $options: '$i' } },
        { "category": { $regex: `${keyword}`, $options: '$i' } }
      ]
    })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
  }
  
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/new/create', (req, res) => {
  const newRestaurant = req.body    
  return Restaurant.create(newRestaurant)    
    .then(() => res.redirect('/')) 
    .catch(error => console.log(error))
})

// 導到詳細頁
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})
// 導到編輯頁
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// 更新餐廳詳細資料
router.post('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save() 
    })
    .then(() => res.redirect(`/${id}`))
    .catch(error => console.log(error))
})

router.post('/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(Restaurant => Restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router