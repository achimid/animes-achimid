const publicVapidKey = 'BKxgy-aMo16cTxKfoiKDZyKmBPcAuUtmUQd2IP9AAEdj-HEa-G2EkxuOa4QGRDDtB76e3X-gLmdt2Bd4kpMAIM8';


function registerWebPushSafe() {
    return new Promise((resolve, reject) => {
        registerWebPush()
            .then(resolve)
            .catch(() => registerWebPush()
                .then(resolve)
                .catch(reject)
            )
            .catch(reject)
    })
}

async function registerWebPush() {
    if ('serviceWorker' in navigator) {
        console.log('Registering service worker');
        const registration = await navigator.serviceWorker.register('/worker.js', { scope: '/' });

        console.log('Registered service worker');

        console.log('Registering push');
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        console.log('Registered push');

        console.log('Sending push');
        await fetchPost('/api/v1/push/register', subscription);

        console.log('Sent push');
    } else {
        console.error('Notificação Web Push não permitida ou não suportada!')
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


function messageAllowNotification() {
    Toastify({
        text: `Para receber notificações, primeiro é necessário habilita-las no seu navegador`,
        duration: 8000,
        stopOnFocus: true
    }).showToast();
}

function messagePostSubscriveSuccess() {
    Toastify({
        text: `Combinado! Você será notificado quando houver um novo lançamento desse anime!`,
        duration: 5000
    }).showToast();
}

function messagePostUnsubscriveSuccess() {
    Toastify({
        text: `Combinado! Você não será mais notificado sobre esse anime!`,
        duration: 5000
    }).showToast();
}


function messageThanksForPermission() {
    Toastify({
        text: `Obrigado por habilitar as permissões de notificação`,
        duration: 5000
    }).showToast();
}

async function allowWebPush() {
    return new Promise((resolve, reject) => {
        if (Notification.permission != 'granted') {
            messageAllowNotification()
            Notification.requestPermission().then(function (permission) {
                if (permission == 'granted') {
                    messageThanksForPermission()
                    resolve()
                } else {
                    reject()
                }
            });
        } else {
            resolve()
        }
    })
}

async function fetchPostSubscription(animeId) {
    fetchPost(`/api/v1/push/subscribe`, { animeId })
        .then(messagePostSubscriveSuccess)
}

async function subscribePost(id) {
    return allowWebPush()
        .then(registerWebPushSafe)
        .then(() => fetchPostSubscription(id))
}

function notifySite(site) {
    this.event.preventDefault()
    console.log(site)
    Toastify({
        text: `Ops... ainda não finalizamos essa funcionalidade. Será implementada em breve.`,
        duration: 5000
    }).showToast();
}

function notifyAnime(e, id) {
    this.event.preventDefault()
    subscribePost(id).then(() => {
        if (document.location.href.indexOf('/info') >= 0) {
            document.querySelector('.entry-header a').remove()
            document.querySelector('.entry-header').innerHTML = `
            <a href="#" target="_blank" onclick="notifyAnimeCancel(this, '${id}')" class="cls-notify" title="Gostaria de ser não ser mais notificado!">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m.5 13.5l13-13M6 13.5h2M8.73.84A4.51 4.51 0 0 0 2.5 5v2.5M3 11h10.5a2 2 0 0 1-2-2V5a4.42 4.42 0 0 0-.5-2"/></svg>
            </a>  ` + document.querySelector('.entry-header').innerHTML

        } else if (document.location.href.indexOf('/notifications') >= 0) {
            const parent = e.parentElement
            e.remove()
            parent.innerHTML += `
            <a href="#" target="_blank" onclick="notifyAnimeCancel(this, '${id}')"  class="cls-notify text-rigth">      
            <svg xmlns="http://www.w3.orxg/2000/svg" width="21" height="21" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m.5 13.5l13-13M6 13.5h2M8.73.84A4.51 4.51 0 0 0 2.5 5v2.5M3 11h10.5a2 2 0 0 1-2-2V5a4.42 4.42 0 0 0-.5-2"/></svg>
            </a>  
        `
        } else {
            const parent = e.parentElement
            e.remove()
            parent.innerHTML += `
            <a href="#" target="_blank" onclick="notifyAnimeCancel(this, '${id}')"  class="cls-notify ${isAuthenticated() ? '' : 'cls-notify-not-logged'}">      
            <svg xmlns="http://www.w3.orxg/2000/svg" width="21" height="21" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m.5 13.5l13-13M6 13.5h2M8.73.84A4.51 4.51 0 0 0 2.5 5v2.5M3 11h10.5a2 2 0 0 1-2-2V5a4.42 4.42 0 0 0-.5-2"/></svg>
            </a>  
        `
        }
    })
}

function notifyAnimeCancel(e, animeId) {
    this.event.preventDefault()
    fetchPost(`/api/v1/push/unsubscribe`, { animeId }).then(messagePostUnsubscriveSuccess).then(() => {
        if (document.location.href.indexOf('/info') >= 0) {
            document.querySelector('.entry-header a').remove()
            document.querySelector('.entry-header').innerHTML = `
            <a href="#" target="_blank" onclick="notifyAnime(this, '${animeId}')" class="cls-notify" title="Gostaria de ser notificado quando houver um novo lançamento!">
                <svg width="30" height="30" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </a>  ` + document.querySelector('.entry-header').innerHTML
        } else if (document.location.href.indexOf('/notifications') >= 0) {
            const parent = e.parentElement
            e.remove()
            parent.innerHTML += `
            <a href="#" target="_blank" onclick="notifyAnime(this, '${animeId}')"  class="cls-notify text-rigth">
                <svg width="21" height="21" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </a>  `
        } else {
            const parent = e.parentElement
            e.remove()
            parent.innerHTML += `
            <a href="#" target="_blank" onclick="notifyAnime(this, '${animeId}')"  class="cls-notify ${isAuthenticated() ? '' : 'cls-notify-not-logged'}">
                <svg width="21" height="21" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </a>  `
        }
    })
}