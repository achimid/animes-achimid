const fs = require('fs')
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

router.get('/users-views-info', async (req, res) => {
    res.json(getUserViewsInfo())
})

const mapUserFields = (user) => {
    return {
        userId: user?.userId,
        animeToNotify: user?.animeToNotify,
        releaseNotified: user?.releaseNotified
    }
}

function loadUsersViewsInfo() {
    try {
        const info = fs.readFileSync(process.env.PATH_USERS_VIEWS_INFO,{ encoding: 'utf8', flag: 'r' })
        return JSON.parse(info) || {}
    } catch (error) {
        fs.writeFileSync(process.env.PATH_USERS_VIEWS_INFO, JSON.stringify({}),{encoding:'utf8',flag:'w'})
        return loadUsersViewsInfo()
    }
}

setInterval(() => {
    fs.writeFileSync(process.env.PATH_USERS_VIEWS_INFO, JSON.stringify(userCounter),{encoding:'utf8',flag:'w'})
}, 60 * 1000 * 1)

const userCounter = loadUsersViewsInfo()

const countUserViews = (id) => {
    userCounter[id] = (userCounter[id] || 0) + 1
}

const getUserViewsInfo = () => {
    const users = Object.keys(userCounter).map(function(key){ return userCounter[key] })
    const views = calculateSum(users)

    return {users: users.length, views}
}

function calculateSum(array) {
    return array.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
}

module.exports = router