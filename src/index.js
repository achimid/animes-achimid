require('dotenv').config()

const maxAge = process.env.NODE_ENV == 'production' ? 1 * 86400000 : 0

const path = require('path')
const cors = require('cors')
const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const fs = require('fs').promises;

const app = express()
const routes = require('./config/routes')

const { databaseInit } = require('./config/database')
const extractor = require('./extractor/extractor-service')
const { configurePassport } = require('./auth/auth-middleware')

app.use(cors())

app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.disable('x-powered-by')

app.use(express.static('public', { maxAge, extensions: ['html', 'xml'] }))
app.use('/anime', express.static('public', { maxAge, extensions: ['html', 'xml'] }))

const animeInfoService = require('./anime-info/anime-info-service')

// For SEO Engines
app.get('/anime/:id', async (req, res) => {
    const anime = await animeInfoService.findAnimeInfoById(req.params.id)

    let fileContent = await fs.readFile(path.join('public', 'info.html'), 'utf8');
    const animeNameScaped = anime.name.replace(/"/g, '')
    const animeDescriptionScaped = anime.description.replace(/"/g, '')

    fileContent = fileContent
                .replace('<title>Anime Info – Animes Achimid</title>', `<title>${animeNameScaped} – Animes Achimid</title>`)
                .replace('<meta content="Animes Achimid" property="og:title">', `<meta content="${animeNameScaped} – Animes Achimid" property="og:title"></meta>`)
                .replace('<h1 class="entry-title">...</h1>', `<h1 class="entry-title">${animeNameScaped}</h1>`)    
                .replace('<meta name="keywords" content="Animes Achimid, Anime, Download,', `<meta name="keywords" content="${animeNameScaped}, Anime, Download,`)    
                .replace('<meta name="description" content="" property="og:description">', `<meta name="description" content="${animeDescriptionScaped}" property="og:description">`)    

    res.send(fileContent);
})


databaseInit()
    .then(() => configurePassport(app))
    .then(() => routes(app))
    .then(extractor.start)

app.listen(process.env.PORT)
