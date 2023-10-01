const fetch = require('node-fetch')

const Release = require('./release-model')
const pushService = require('../push/push-service')
const animeService = require('../anime/anime-service')
const statusService = require('../status/status-service')
const releaseRepository = require('./release-repository')
const animeModel = require('../anime/anime-model')

const findLast = releaseRepository.findLast

const findByQuery = releaseRepository.findByQuery

const processRelease = async (integration) => {
    
    const { anime, episode } = integration
    let animeExternal

    try {
        const animeExternalList = await fetch(process.env.ANIME_INFO_API_URL + '?q=' + encodeURI(integration.anime)).then(res => res.json())
        animeExternal = animeExternalList[0]        
    } catch (error) {
        console.log(error)    
    }

    if (!animeExternal) {
        console.error('Erro on find anime... ', integration.anime)
        return
    }
    
    console.log('-----------', animeExternal.name, anime)

    // const animeId = (await animeService.findByAnimeName(anime))._id.toString()
    // const release = await releaseRepository.findByAnimeIdAndEpisode(animeId, episode)
    
    const release = await releaseRepository.findByAnimeIdAndEpisode(animeExternal._id, episode)

    if (!release) return createFromIntegration(integration, animeExternal).then(pushService.notifyAnime)

    if (!alreadyHasSource(release, integration)) {
        return updateFromIntegration(release, integration).then(pushService.notifyAnime)
    }
    
    console.log(`Discarded integration event. anime=${anime} animeFound=${release.anime.name} episode=${episode}`)
}


const alreadyHasSource = (release, i) => {
    return release.sources.filter(s => s.title == i.from).length > 0
}

const updateFromIntegration = async (release, i) => {
    console.log(`Updating release. anime=${i.anime} episode=${i.episode}`)

    release.sources.push({
        title: i.from,
        url: i.url
    })

    statusService.updateLastRelease(i.from)

    if (release.mirrors && i.data && i.data.mirrors) {
        if (release.mirrors.length <= 1 && i.data.mirrors.length > 0) {
            for (let j = 0; j < i.data.mirrors.length; j++) {
                const mirror = i.data.mirrors[j];
                
                if (release.mirrors.filter(m => m.description == mirror.description).length == 0) {
                    release.mirrors.push(mirror)    
                }
            }
        }
    }

    release.updatedAt = new Date()

    return releaseRepository.save(release)
}

const createFromIntegration = async (i, animeExternal) => {
    console.log(`Creating new release. anime=${i.anime} episode=${i.episode}`)
    
    // const anime = await animeService.findByAnimeName(i.anime)
    // anime.source = undefined

    statusService.updateLastRelease(i.from)

    return releaseRepository.save(new Release({

        title: `Episódio: ${(i.episode || '0').toString().padStart(2, '0')} - ${animeExternal.name}`,
        episode: i.episode,
        anime: animeExternal,
        mirrors: (i.data || {}).mirrors,
        sources: [{ title: i.from, url: i.url }]
    }))
}

module.exports = {
    findLast,
    findByQuery,
    processRelease
}