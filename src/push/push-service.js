const webpush = require('web-push')

const publicVapidKey = process.env.PUSH_KEY_PUBLIC
const privateVapidKey = process.env.PUSH_KEY_PRIVATE

webpush.setVapidDetails('mailto:achimid@hotmail.com', publicVapidKey, privateVapidKey)

const userService = require('../user/user-service')

const register = async (userId, subscription) => {    
    const user = await userService.findById(userId)
    if (user.webSubscription) return

    await userService.register(user, subscription)
    await sendPushWellcomeTest(subscription)
}

const notifyAnime = async (release) => {
    const animeId = release.anime._id || release.anime.id
    const episode = release.episode

    const userToNotify = await userService.findByAnimeToNotify(animeId)
    const userNotNotified = userToNotify
        .filter(u => u.webSubscription)
        .filter(u => u.releaseNotified.filter(n => n.animeId == animeId && n.episode == episode).length == 0)

    for (let i = 0; i < userNotNotified.length; i++) {
        const user = userNotNotified[i];
        
        sendReleasePush(user, release.title)
        
        user.releaseNotified.push({animeId, episode, releaseTitle: release.title})
        await userService.save(user)
    }
}

const subscribe = userService.subscribe

const unsubscribe = userService.unsubscribe

const sendPushWellcomeTest = (subscription) => {
    const payload = JSON.stringify({ 
        title: 'Animes Achimid - Bem vindo!', 
        options: {
            body: 'Obrigado por nos visitar.\n\nOs próximos lançamentos serão enviados em forma de notificação para esse dispositivo.', 
            data: { url: '/' },
            icon: '/favicon/favicon-32x32.png'
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
        title: 'Animes Achimid - Novo lançamento', 
        options: {
            body: `[${title}] acabou de ser lançado. Hora de assistir!`, 
            data: { url: '/' },
            icon: '/favicon/favicon-32x32.png'
        }
    })
    sendPush(user.webSubscription, payload)
}

module.exports = {
    register,
    subscribe,
    unsubscribe,
    notifyAnime,
    sendPushById,
    sendReleasePush
}