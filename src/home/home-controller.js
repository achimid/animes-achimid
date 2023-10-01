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




module.exports = router