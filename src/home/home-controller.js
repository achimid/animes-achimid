const fetch = require('node-fetch')
const router = require('express').Router()
const { OK } = require('http-status-codes').StatusCodes

const releaseService = require('../release/release-service')
const statusService = require('../status/status-service')



router.get('/',  async (req, res) => {
    return releaseService.findLast()
        .then(releases => res.status(OK).json(releases))
        .catch(res.onError)
})

router.get('/search',  async (req, res) => {
    return releaseService.findByQuery(req.query.q, req.query.skip)
        .then(releases => res.status(OK).json(releases))
        .catch(res.onError)
})

router.get('/status',  async (req, res) => {
    return statusService.getStatus()
        .then(status => res.status(OK).json(status))
        .catch(res.onError)
})

router.get('/schedule',  async (req, res) => {
    fetch("https://subsplease.org/api/?f=schedule&h=true&tz=America/Sao_Paulo")
        .then(r => r.json())
        .then(json => res.json(json))
        .catch(res.send)
})


router.get('/anime/:id',  async (req, res) => {
    return releaseService.findByAnimeId(req.params.id)
        .then(releases => res.status(OK).json(releases))
        .catch(res.onError)
})


router.get('/list/names', async (req, res) => {
    return releaseService.findAnimeNames()
        .then(json => res.status(OK).json(json))
        .catch(res.onError)
})

router.post('/message/send', async (req, res) => {
    fetch('https://telegram-notify-api.achimid.com.br/api/v1/message/send', {
        method: 'POST',
        body: JSON.stringify({
            token: '5806553287:AAFtDgYzUWMgJvO-Slotz19GyQEPxYa4SHg',
            id: '128348430',
            text: req.body.message
        }),
        headers: {'Content-Type': 'application/json'}
    }).catch(console.error)    

    res.send()
})


module.exports = router