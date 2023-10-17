const publicVapidKey = 'BFmriORysfLRjUGB7Nt5jfFIPBvC1ulYQuHfleLN9xTZlS4XdAEVyrBRYbvYzLsmZU9KvHerIqHluuRH3ZGOV58';

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

async function createId() {
    if (localStorage.getItem('ani_fan_id')) {
        return localStorage.getItem('ani_fan_id')
    }
    
    return fetch('/api/v1/user', { method: 'POST'})
        .then(res => res.json())
        .then(({ _id }) => {
            localStorage.setItem('ani_fan_id', _id)
            return _id
        })    
}

function getId() {
    const id = localStorage.getItem('ani_fan_id')
    
    if (id == undefined || id == 'undefined') {
        setTimeout(createId, 5000)
        return null
    }

    return id
}

async function fetchGet(uri) {    
    return fetch(uri, { 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // 'X-Anifan-User-UUID': getId()
        }
    })
}

async function fetchPost(uri, body = {}) {
    return fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Anifan-User-UUID': getId()
        },
        body: JSON.stringify(body)
    })
    
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}