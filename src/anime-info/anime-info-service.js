const fetch = require('node-fetch')
var crypto = require('crypto')

const releaseRepository = require('../release/release-repository')

const ANIME_INFO_API_URL  = process.env.ANIME_INFO_API_URL 
let cache = {}

const sync = async (recursive = false) => {
    const allReleases = await releaseRepository.findAll()
    const animesIds = [...new Set(allReleases.map(release => release.anime._id))]

    for (let i = 0; i < animesIds.length; i++) {
        console.log(`${i}/${animesIds.length}`)        
        const animeId = animesIds[i]

        const anime = await findAnimeInfoById(animeId)
        const releases = allReleases.filter(release => release.anime._id == animeId)
        
        if (anime == null) continue;

        for (let j = 0; j < releases.length; j++) {
            console.log(`${j}/${releases.length}`)        
            const release = releases[j]

            if (JSON.stringify(anime) !== JSON.stringify(release.anime)) {
                release.anime = anime
                await release.save().catch(console.error)
                console.log('Release.Anime atualizado...' + release.anime.name)
            }        
        }

        if (recursive) await sleep(300)
    }

    if (recursive) {
        await sleep(10 * 60 * 1000)
        sync(recursive)
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const syncByAnimeId = async (id) => {
    const allReleases = await releaseRepository.findAll({'anime._id': id})

    for (let i = 0; i < allReleases.length; i++) {
        console.log(`${i}/${allReleases.length}`)        
        const release = allReleases[i];

        const anime = await findAnimeInfoById(release.anime._id)

        if (anime == null) continue;
        if (JSON.stringify(anime) !== JSON.stringify(release.anime)) {
            release.anime = anime
            await release.save().catch(console.error)
            console.log('Release.Anime atualizado...' + release.anime.name)
        }        
    }
}

const findAnimeInfoByQuery = async (query) => {
    if (cache[query] != null) return cache[query]

    try {
        const animeExternalList = await fetch(`${ANIME_INFO_API_URL}/search?q=${encodeURI(query)}`).then(res => res.json())
        const animeExternal = animeExternalList[0]
        if (!animeExternal || animeExternal.name == undefined || animeExternal.image == undefined) {
            console.error('Anime sem imagem ou nome', animeExternal)
            return null
        }

        cache[query] = animeExternal
        return animeExternal
    } catch (error) {
        console.error(error)
    }

    return null
}

const findAnimeInfoById = async (id) => {

    if (cache[id] != null) return cache[id]
    
    try {
        const animeExternal = await fetch(`${ANIME_INFO_API_URL}/anime/${id}`).then(res => res.json())
        if (!animeExternal || animeExternal.name == undefined || animeExternal.image == undefined) {
            console.error('Anime sem imagem ou nome', animeExternal)
            return null
        }

        cache[id] = animeExternal

        return animeExternal
    } catch (error) {
        console.error(error)
    }

    return null
}

setInterval(() => { cache = {}}, 1000 * 60 * 5)
sync(true)

module.exports = {
    sync,
    syncByAnimeId,
    findAnimeInfoById,
    findAnimeInfoByQuery
}