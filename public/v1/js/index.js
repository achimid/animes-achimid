const $list = document.querySelector("#accordion")
const $navLogin = document.querySelector("#nav-login")
const $statusList = document.querySelector("#statusList")

const isAuth = getCookie('X-Anifan-Token-JWT')

load()
isAuth ? $navLogin.classList.add("d-none") : $navLogin.classList.remove("d-none")

async function load() {
    return changeStyle("grid")
}

function changeStyle(type) {
    fetchGet("/api/v1/home")
        .then(res => res.json())
        .then(prepareData)
        .then(json => {
            if (type == 'grid') {
                gridStyle(json)
            } else {
                $list.innerHTML = ""
                json.map(item => { $list.innerHTML = $list.innerHTML + createListItem(item)})    
                eventDone()        
            }
        })  
    
}

function prepareData(json) {
    return json.map(item => {
        item.detail = item.anime
        item.id = item._id

        if (!item.detail || !item.detail.name) {
            item.detail = {}
            
            fetchPost('/api/v1/detail', {anime: item.anime})
        }

        if (!item.detail.extra) item.detail.extra = []
        if (!item.detail.name) item.detail.name = 'Título'
        if (!item.detail.image) item.detail.image = '/img/bg.webp'
        if (!item.detail.description) item.detail.description = ''
        if (!item.detail.mal) item.detail.mal = ''
        if (item.detail.extra && item.detail.extra.length > 0) {
            item.detail.extra = item.detail.extra.map(extra => { 
                if (!extra.value) extra.value = '(?)'

                return extra
            })
        }
        if (!item.sources || !item.sources.length) {
            item.sources = item.sources.map(src => { 
                if (!src.url) src.url = '#'
                if (!src.url) src.title = 'Título'

                return src
            })
        }
        
        return item
    })
}

function createListItem(item) {
    return `
    <article>
        <div class="card list-item">
            <div class="card-header" id="heading${item.id}">                
                <div class="row"> 
                    <div class="col-md-12 col-lg-9">
                        <h2 class="mb-0">
                            <button class="btn btn-block text-left font-weight-bold collapsed" type="button" data-toggle="collapse" data-target="#collapse${item.id}" aria-expanded="true" aria-controls="collapse${item.id}">                                
                                ${item.title}
                            </button>
                        </h2>
                    </div>                  
                    <div class="col-md-12 col-lg-3 text-right">
                        <h5>
                            ${createListItemMirrors(item.mirrors)}                            
                        </h5>
                    </div>                  
                </div>
            </div>
            ${createItemDetail(item.id, item.detail, item.sources)}
        </div>
    </article>
    `
}

function createItemDetail(id, detail, sources) {

    return `
        <div id="collapse${id}" class="collapse" aria-labelledby="heading${id}" data-parent="#accordion">
            <div class="card-body">
                <div class="media">
                    <div class="d-none d-lg-block d-xl-block">
                        <img alt="Imagem de capa do anime: ${detail.name}" src="${detail.image}" class="rounded float-left align-self-center card-img mr-3">
                    </div>                    
                    <div class="media-body">
                        <div class="row">
                            <div class="col-md-12 col-lg-8">
                                <div class="row"> 
                                    <div class="col-md-9"> 
                                        <h5 class="mt-0 font-weight-bold">${detail.name}</h5>                                
                                        <h6><a href="${detail.url}" class="badge badge-secondary">My Anime List</a></h6>                                        
                                    </div>
                                    <div class="col-md-3 text-left ${!isAuth ? 'd-none' : ''}">                                     
                                        <div class="float-right">
                                            <button type="button" onClick="subscribePost(this, '${detail._id}')" class="badge badge-secondary" title="Ser notificado quando um novo episódio desse anime for lançado">
                                                <i data-feather="bell"></i> Quero ser notificado
                                            </button>
                                            <button type="button" href="#" class="d-none btn btn-secondary btn-sm mt-2 text-left" title="Marcar esse episódio como assistido.">
                                                <i data-feather="eye"></i>
                                            </button>               
                                        </div>
                                    </div>
                                </div>
                                <p class="text-justify line-clamp">${detail.description}</p>
                            </div>
                            <div class="col-md-12 col-lg-4">
                                <div class="list-group">               
                                    ${createDetailSource(sources)}
                                </div>
                            </div>
                        </div>      
                        ${createDetailExtra(detail.extra)}            
                    </div>
                </div>
            </div>
        </div>    
    `
}

function createDetailSource(sources) {
    if (sources.length == 0) return `<p class="text-center"> Nenhum conteúdo disponível </p>`

    return sources.map(item => {
        return `
            <a href="${item.url}" class="btn btn-info btn-sm btn-block mt-2">${item.title}</a>
        `
    }).join("")
}

function createListItemMirrors(mirrors) {    
    if (!isAuth) return ''

    const list = mirrors.map(item => {
        return `
            <a href="${item.url}" class="badge badge-info">${item.description}</a>
        `
    })

    return list.join('')
}

function createDetailExtra(extra) {
    if (extra.length == 0) return ""

    const extraItem = extra.map(item => createDetailExtraItem(item)).join("")

    return `
        <div class="row">
            ${extraItem}
        </div>
    `
}

function createDetailExtraItem(item) {
    return `
        <div class="col-md-6 col-lg-${item.size || 2}">
            <div class="font-weight-bold">${item.key}:</div> ${item.value}
        </div>
    `
}

function messageAllowNotification() {
    Toastify({
        text: `Para receber notificações, primeiro é necessário habilita-las no seu navegador`,
        duration: 8000,
        stopOnFocus: true
    }).showToast();
}

function messagePostSubscriveSuccess(post) {
    Toastify({
        text: `Combinado! Você será notificado quando houver um novo lançamento desse anime!`,
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

async function fetchPostSubscription(event, animeId){ 
    fetchPost(`/api/v1/push/subscribe`, { animeId })
        .then(messagePostSubscriveSuccess)
        .then(() => event.remove())
}

async function subscribePost(event, id) {
    return allowWebPush()
        .then(registerWebPushSafe)
        .then(() => fetchPostSubscription(event, id))   
}

function eventDone() {
    feather.replace()
    document.querySelector('.collapsed').click()
}


function gridStyle(json) {
    const cards = json.map(createCard).join("")
    $list.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="row grid-style">
                ${cards}
            </div>                   
        </div>
    `
    addNewBadge()
}

function addNewBadge() {
    [...document.querySelectorAll('.product')].map(e => {
    [...e.querySelectorAll('.list-group > .btn-info')].slice(-1)[0].innerHTML += '<span class="badge badge-secondary">New</span>'
    })          
}

function createCard(item) {
    return `
    <div class="product">
        <div class="imgbox"> <img src="${item.anime.image}"> </div>
        <div class="specifies">
            <h5>
                <a href="${item.anime.url}">
                    ${item.anime.name}
                </a>
                <span>Epi. ${item.episode}</span>
            </h5>

            <div class="list-group">
            ${
                item.sources.map(source => {
                return `<a href="${source.url}" class="btn btn-info btn-sm btn-block mt-2">${source.title}</a>`
                }).join("")
            }                    
            </div>
        </div>
    </div>
    `
}

async function updateStatus() {
    fetchGet("/api/v1/home/status")
        .then(res => res.json())
        .then(json => {
            const status = Object.entries(json).map(i => i[1])
            const statusHtml = status.map(s => {
                return `
                <li>
                    <a href="${s.url}" class="btn btn-dark">
                    [${s.lastRelease}] - [${s.lastExecution}] - <span class="badge ${s.status || !!s.lastRelease ? "badge-success" : "badge-danger"}">${s.status || !!s.lastRelease ? "Sucesso" : "Falha"}</span> - ${s.name}
                    </a>
                </li>
                `
            }).join("")

            $statusList.innerHTML = statusHtml
        })
}

updateStatus()
setInterval(updateStatus, 60000)