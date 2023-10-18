const healthcheck = require('./healthcheck')
const home = require('../home/home-controller')
const push = require('../push/push-controller')
const user = require('../user/user-controller')
const authController = require('../auth/auth-controller')
const animeInfo = require('../anime-info/anime-info-controller')
const integration = require('../integration/integration-controller')

const { errorHandler } = require('./error-handler')
const { preAuthHeader, auth } = require('../auth/auth-middleware')

const prefix = process.env.API_PREFIX + process.env.API_VERSION

module.exports = (app) => {
    console.info(`Registrando rotas...`)

    app.use(errorHandler)
    app.use(preAuthHeader)

    app.use(`${prefix}`, healthcheck)
    app.use(`${prefix}/home`, home)
    app.use(`${prefix}/anime-info`, animeInfo)
    app.use(`${prefix}/push`, auth, push)
    app.use(`${prefix}/user`, auth, user)

    app.use(`${prefix}/auth`, authController)
    app.use(`${prefix}/integration`, integration)


    console.info(`Rotas registradas com sucesso...`)

    return app
}