const Release = require('./release-model')
const pushService = require('../push/push-service')
const animeInfoService = require('../anime-info/anime-info-service')
const statusService = require('../status/status-service')
const releaseRepository = require('./release-repository')

const findLast = releaseRepository.findLast

const findByQuery = releaseRepository.findByQuery

const findByAnimeId = releaseRepository.findByAnimeId

const findAnimeNames = releaseRepository.findAnimeNames

const processRelease = async (integration) => {

    const { anime, episode } = integration
    const animeExternal = await animeInfoService.findAnimeInfoByQuery(integration.anime)

    if (!animeExternal || animeExternal.name == undefined) {
        console.error('Erro on find anime... ', integration.anime)
        return
    }

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
    findByAnimeId,
    findAnimeNames,
    processRelease
}