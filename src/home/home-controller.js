const fetch = require('node-fetch')
const router = require('express').Router()
const { OK } = require('http-status-codes').StatusCodes

const releaseService = require('../release/release-service')
const statusService = require('../status/status-service')
const animeInfoService = require('../anime-info/anime-info-service')
const extractorService = require('../extractor/extractor-service')


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

let cacheSchedule

setInterval(() => cacheSchedule = null, 60 * 1000 * 5)

router.get('/schedule',  async (req, res) => {

    if (!!cacheSchedule) return res.json(cacheSchedule)

    fetch("https://subsplease.org/api/?f=schedule&h=true&tz=America/Sao_Paulo")
        .then(r => r.json())
        .then(enrichSchedule)
        .then(json => { 
            cacheSchedule = json
            res.json(json)
        })
        .catch(res.send)
})

const enrichSchedule = async (json) => {
    const animeInfo = await Promise.all(json.schedule.map(async (s) => {
        return {
            ...s,
            anime: await animeInfoService.findAnimeInfoByQuery(s.title)
        }        
    }))
    return {schedule: animeInfo}
}


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


router.get('/extractor/force', async (req, res) => {
    res.status(OK).json()

    extractorService.execute()
})

router.get('/fix/from/:fromId/to/:toId', async (req, res) => {
    return releaseService.fixJoinAnime(req.params.fromId, req.params.toId)
        .then(releases => res.status(OK).json(releases))
        .catch(res.onError)    
})


module.exports = router