const router = require('express').Router()
const { CREATED } = require('http-status-codes').StatusCodes

const pushService = require('./push-service')

router.post('/register', async (req, res) => {
    
    const user = req._user
    const subscription = req.body

    return pushService.register(user, subscription)
        .then(() => res.status(CREATED).send())
        .catch(res.onError)
})

router.post('/subscribe', async (req, res) => {
    
    const user = req._user
    const { animeId } = req.body

    return pushService.subscribe(user, animeId)
        .then(() => res.status(CREATED).send())
        .catch(res.onError)
})


module.exports = router