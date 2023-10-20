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

async function fetchPostSubscription(animeId){ 
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
}

function notifyAnime(id) {
    this.event.preventDefault()
    subscribePost(id)
}

function notifyAnimeCancel(animeId) {
    this.event.preventDefault()    
    fetchPost(`/api/v1/push/unsubscribe`, { animeId }).then(messagePostUnsubscriveSuccess)
}