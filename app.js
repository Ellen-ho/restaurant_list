// require packages used in the project
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

const app = express()

const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')


// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true  })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  console.log('IN HOME!!')
   Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.eroor(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find({
    "$or": [
      { "name": { $regex: `${keyword}`, $options: '$i' } },
      { "category": { $regex: `${keyword}`, $options: '$i' } }
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
})

app.get('/new', (req, res) => {
  return res.render('new')
})

app.post('/new/create', (req, res) => {
  const newRestaurant = req.body    
  return Restaurant.create(newRestaurant)    
    .then(() => res.redirect('/')) 
    .catch(error => console.log(error))
})

// 導到詳細頁
app.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})
// 導到編輯頁
app.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
// 更新餐廳詳細資料
app.post('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save() 
    })
    .then(() => res.redirect(`/${id}`))
    .catch(error => console.log(error))
})

app.post('/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(Restaurant => Restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})