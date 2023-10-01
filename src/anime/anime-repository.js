const Anime = require('./anime-model')
const stringUtils = require('../utils/string-utils')

const animeNotFound = new Set()

const save = async (anime) => {
    return anime.save()
}

const findById = async (id) => {
    return Anime.findById(id)
}

const update = async (id, data) => {
    const anime = await findById(id, data)

    return save({...anime, data})
}

const findByExactName = async (name) => Anime.findOne({ name })

const findByName = async (name) => {
    const found = await Anime.findOne({  $or: [ { name }, { names: name }] })
    
    if (found) return found

    const similar = await findIdByNameSimilarity(name)

    if (similar && similar.names && !similar.names.includes(name)) {
        similar.names.push(name)
        await save(similar)
    } else {
        animeNotFound.add(name)
    }

    return similar
}

const findIdByNameSimilarity = async (name) => {
    if (animeNotFound.has(name)) {
        console.log('*-*-*-*-*-*- Anime já identificado como not found')
        return null
    }

    const allAnimes = await Anime.find({}, '_id name names').lean() // TODO: Melhorar e corrigir isso, vai quebrar o sistema no futuro.
    
    const selectedId = await selectBestMatch(name, allAnimes)
    if (selectedId) {
        return Anime.findById(selectedId)
    }

    return null
}

const selectBestMatch = (name, allAnimes) => {

    if (!allAnimes) return null

    const fMapName = (d) => [d.name, ...(d.names || [])]

    return stringUtils.selectBestMatch(name, allAnimes, fMapName)
}

const listAnimeNotFound = async () => {
    return [...animeNotFound]
}

module.exports = {
    save,
    update,
    findById,
    findByName,
    findByExactName,
    findIdByNameSimilarity,
    listAnimeNotFound
}