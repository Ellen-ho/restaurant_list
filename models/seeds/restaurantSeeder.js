if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantJSON = require('./restaurant.json').results

const SEED_USERS = [
  {
    email: 'user1@example.com',
    password: '12345678',
    restaurantList: [1, 2, 3]
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurantList: [4, 5, 6]
  }
]

db.once('open', () => {
  for (let i = 0; i < SEED_USERS.length; i++) {
    const seedUser = SEED_USERS[i]
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({
        email: seedUser.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id

        return Promise.all(
          seedUser.restaurantList.map((id) => {
            const restaurant = restaurantJSON.find(restaurant => restaurant.id === id)
            return Restaurant.create({ ...restaurant, userId })
          })
        )
      })
      .then(() => {
        console.log('done.')
        process.exit()
      })
  }
})
