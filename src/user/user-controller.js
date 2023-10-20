const router = require('express').Router()
const { CREATED } = require('http-status-codes').StatusCodes

const userService = require('./user-service')

router.post('/', async (req, res) => {
    return userService
        .create(req._user || req.body)
        .then(user => res.status(CREATED).json(mapUserFields(user))) 
        .catch(res.onError)
})

router.post('/anonymous', async (req, res) => {
    const userId = req.headers['x-animes-achimid-user-id']

    countUserViews(userId)

    return userService
        .create({userId})
        .then(user => res.status(CREATED).json(mapUserFields(user))) 
        .catch(res.onError)
})

router.get('/', async (req, res) => {
    const userId = req.headers['x-animes-achimid-user-id']

    countUserViews(userId)

    return userService
        .findById(userId)
        .then(user => res.status(CREATED).json(mapUserFields(user))) 
        .catch(res.onError)
})

const mapUserFields = (user) => {
    return {
        userId: user.userId,
        animeToNotify: user.animeToNotify,
        releaseNotified: user.releaseNotified
    }
}

const userCounter = {}

const countUserViews = (id) => {
    userCounter[id] = (userCounter[id] || 0) + 1
}

setInterval(() => {
    const users = Object.keys(userCounter).map(function(key){ return userCounter[key] })
    const views = calculateSum(users)

    console.log({users: users.length, views})
},  5 * 60 * 1000)

function calculateSum(array) {
    return array.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
}

module.exports = router