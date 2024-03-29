require('dotenv').config()

const maxAge = process.env.NODE_ENV == 'production' ? 1 * 86400000 : 0

const path = require('path')
const cors = require('cors')
const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')

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

const baseDir = process.cwd()
app.get('/anime/:id', (req, res) => {
    res.sendFile(path.join(baseDir + '/public/info.html'))
})


databaseInit()
    .then(() => configurePassport(app))
    .then(() => routes(app))
    .then(extractor.start)

app.listen(process.env.PORT)
