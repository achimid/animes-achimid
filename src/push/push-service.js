const webpush = require('web-push')

const publicVapidKey = process.env.PUSH_KEY_PUBLIC
const privateVapidKey = process.env.PUSH_KEY_PRIVATE

webpush.setVapidDetails('mailto:anifan-site@outlook.com', publicVapidKey, privateVapidKey)

const userService = require('../user/user-service')

const register = async (user, subscription) => {    
    if (user.webSubscription) return

    await userService.register(user, subscription)
    await sendPushWellcomeTest(subscription)
}

const notifyAnime = async (release) => {
    const animeId = release.anime.id
    const episode = release.episode

    const userToNotify = await userService.findByAnimeToNotify(animeId)
    const userNotNotified = userToNotify
        .filter(u => u.webSubscription)
        .filter(u => u.releaseNotified.filter(n => n.animeId == animeId && n.episode == episode).length == 0)

    userNotNotified.map(user => sendReleasePush(user, release.title))
}

const subscribe = userService.subscribe

const sendPushWellcomeTest = (subscription) => {
    const payload = JSON.stringify({ 
        title: 'Ani Fan - Bem vindo', 
        options: {
            body: 'Obrigado com nos visitar.\n\nOs próximos lançamentos serão enviados em forma de notificação para esse dispositivo.', 
            data: { url: '/' },
            icon: '/img/bg.webp'
        }
    })

    sendPush(subscription, payload)
}

const sendPush = (subscription, payload) => {
    console.log("Enviando notificação push...")

    webpush.sendNotification(subscription, payload)
        .then(() => console.log("Notificação enviada com sucesso."))
        .catch(error => console.error("Erro ao enviar notificação: ", error.stack))  
}

const sendPushById = (userId, body) => {
    sendPush(subscribers[userId], JSON.stringify(body))
}

const sendReleasePush = (user, title) => {
    const payload = JSON.stringify({ 
        title: 'Ani Fan - Novo lançamento', 
        options: {
            body: `[${title}] acabou de ser lançado. Hora de assistir!`, 
            data: { url: '/' },
            icon: '/img/bg.webp'
        }
    })
    sendPush(user.webSubscription, payload)
}

module.exports = {
    register,
    subscribe,
    notifyAnime,
    sendPushById,
    sendReleasePush
}