const router = require('express').Router()
const { OK } = require('http-status-codes').StatusCodes

const {sync} = require('./anime-info-service')

router.get('/sync', async (req, res) => {
    res.status(OK).send()

    sync()
})

module.exports = router