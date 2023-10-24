const router = require('express').Router()
const { OK } = require('http-status-codes').StatusCodes

const animeInfoService = require('./anime-info-service')

router.get('/sync', async (req, res) => {
    res.status(OK).send()

    animeInfoService.sync()
})

router.get('/sync/:id', async (req, res) => {
    res.status(OK).send()

    animeInfoService.syncByAnimeId(req.params.id)
})

router.get('/show/:id', async (req, res) => {
    return animeInfoService.findAnimeInfoById(req.params.id)
        .then(json => res.status(OK).json(json))
        .catch(res.onError)
})


module.exports = router