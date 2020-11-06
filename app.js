// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
   res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find( restaurant => restaurant.id.toString() === req.params.restaurant_id)  
  res.render('show', { restaurant: restaurant})
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  let filteredRestaurants = [];
  // 若取得空值或空格
  if (keyword === '') {
    res.redirect('/')
  } else {
    filteredRestaurants = restaurantList.results.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render('index', { restaurants : filteredRestaurants , keyword: keyword })
  }
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})