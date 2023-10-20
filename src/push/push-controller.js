const router = require('express').Router()
const { CREATED } = require('http-status-codes').StatusCodes

const pushService = require('./push-service')

router.post('/register', async (req, res) => {
    
    const subscription = req.body
    const userId = req.headers['x-animes-achimid-user-id']

    return pushService.register(userId, subscription)
        .then(() => res.status(CREATED).send())
        .catch(res.onError)
})

router.post('/subscribe', async (req, res) => {
    
    const { animeId } = req.body
    const userId = req.headers['x-animes-achimid-user-id']

    return pushService.subscribe(userId, animeId)
        .then(() => res.status(CREATED).send())
        .catch(res.onError)
})

router.post('/unsubscribe', async (req, res) => {
    
    const { animeId } = req.body
    const userId = req.headers['x-animes-achimid-user-id']

    return pushService.unsubscribe(userId, animeId)
        .then(() => res.status(CREATED).send())
        .catch(res.onError)
})


module.exports = router