const jikanClient = require('./jikan-client')
const atcClient = require('./atc-client')

const Anime = require('./anime-model')

const { save, findById, findByName, update, listAnimeNotFound, findByExactName  } = require('./anime-repository')

const findByAnimeName = async (name) => {
    const anime = await findByName(name)

    if (!anime) return createByName(name)

    return enrichAnimeFromSource(anime, name)
}

const enrichAnimeFromSource = async (anime, nameQuery, malS) => {
    
    const [mal, atc] = await Promise.all([
        !malS ? jikanClient.queryByNameBestMatch(nameQuery) : Promise.resolve(malS),
        atcClient.queryByNameBestMatch(nameQuery)
    ])

    if (!anime.source.mal) {
        if (mal) {
            anime.source.mal =  mal
            anime.url =         mal.url
            anime.name =        mal.title
            anime.names =       [...new Set([mal.title, mal.title_english, mal.title_japanese, nameQuery, ...mal.title_synonyms, ...mal.titles.map(t => t.title)])].filter(s => s)
            anime.description = mal.synopsis
            anime.image =       mal.images.webp.image_url || mal.images.jpg.image_url
            anime.extra = [
                { key: "Episódios",     value: mal.episodes },
                { key: "Ano"      ,     value: mal.year },
                { key: "Estúdios" ,     value: mal.studios.map(i => i.name).join(", ") },
                { key: "Gêneros"  ,     value: mal.genres.map(i => i.name).join(", "), "size": 4 }
            ]
        }
    }

    if (!anime.source.atc) {
        if (atc) {
            anime.source.atc =  atc
            anime.description = !anime.synopsis ? atc.synopsis : anime.description
            anime.name =        !anime.title ? atc.title : anime.title
            anime.names =       !anime.names ? [...new Set([...(anime.names || []), atc.title, atc.slug])].filter(s => s) : [atc.title, atc.slug].filter(s => s)
            anime.image =       'https://stc.animestc.com/' + atc.cover.thumbnailName
            anime.extra = [
                { key: "Episódios",     value: atc.episodeCount },
                { key: "Ano"      ,     value: atc.year },
                { key: "Estúdios" ,     value: atc.producer }, 
                { key: "Gêneros"  ,     value: atc.tags.map(i => i.name).join(", "), "size": 4 }
            ]
        }
    }

    if (!anime.name) anime.name = nameQuery
    
    return anime
}


const createByName = async (name, mal = undefined) => {
        
    const anime = new Anime()
    
    return enrichAnimeFromSource(anime, name, mal).then(save)
}



module.exports = {
    update,
    findById,
    createByName,
    findByExactName,
    findByAnimeName,
    listAnimeNotFound
}