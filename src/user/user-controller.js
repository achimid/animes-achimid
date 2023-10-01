const router = require('express').Router()
const { CREATED } = require('http-status-codes').StatusCodes

const userService = require('./user-service')

router.post('/', async (req, res) => {
    return userService
        .create(req._user || req.body)
        .then(user => res.status(CREATED).json(user)) 
        .catch(res.onError)
})

module.exports = router