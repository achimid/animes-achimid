const Release = require('./release-model')
const mongoose = require('mongoose')

const cache = {}

const findAll = () => Release.find()

const findLast = async () => {
    if (cache.last && cache.last.length > 0) return cache.last

    const last = await Release.find().sort({ updatedAt: -1, _id: -1 }).limit(30).lean()

    cache.last = last
    setTimeout(() => { delete cache.last }, 10000)

    return last
}

const escapeQuery = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const findByQuery = async (query, skip = 0) => {
    if (!!query) {
        return Release.find(
            {
                $or: [
                    { title: { $regex: escapeQuery(query), $options: 'i' } },
                    { 'sources.title': { $regex: escapeQuery(query), $options: 'i' } }]
            })
            .skip(parseInt(skip)).sort({ updatedAt: -1, _id: -1 }).limit(30).lean()
    } else {
        return Release.find().skip(parseInt(skip)).sort({ updatedAt: -1, _id: -1 }).limit(30).lean()
    }
}

const findByAnimeId = async (id) => Release.find({'anime._id': id}).sort({ title: 1 }).lean()

const save = async (release) => {
    return release.save()
}

const findByAnimeIdAndEpisode = async (animeId, episode) => {
    return Release.findOne({ 'anime._id': animeId, episode })
}


module.exports = {
    save,
    findAll,
    findLast,
    findByQuery,
    findByAnimeId,
    findByAnimeIdAndEpisode
}