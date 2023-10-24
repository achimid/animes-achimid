async function onLoad() {

    if (getUser().animeToNotify.length == 0) {
        document.querySelector('.all-notifications').innerHTML = 'Nenhum anime selecionado.'
        return 
    }

    const myAnimesToNotify = await Promise.all(getUser().animeToNotify.map(id => fetch('/api/v1/anime-info/show/' + id).then(res => res.json())))
    
    document.querySelector('.all-notifications').innerHTML = myAnimesToNotify.map(a => {
        return `<div class="all-shows-link">
            <a href="/info?id=${a._id}" data-preview-image="${a.image}" title="${a.name}">${a.name}</a>
            <a href="#" target="_blank" data-preview-image="${a.image}" onclick="notifyAnimeCancel(this, '${a._id}')"  class="cls-notify text-rigth">      
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m.5 13.5l13-13M6 13.5h2M8.73.84A4.51 4.51 0 0 0 2.5 5v2.5M3 11h10.5a2 2 0 0 1-2-2V5a4.42 4.42 0 0 0-.5-2"/></svg>
            </a>            
        </div>
        `
    }).join('')    
    
}

async function getNotifications() {
    if (getUser().releaseNotified.length == 0) {
        document.querySelector('.all-notifications-done').innerHTML = 'Nenhuma notificação enviada.'
        return 
    }


    document.querySelector('.all-notifications-done').innerHTML = getUser().releaseNotified.filter(n => n.releaseTitle != undefined).slice(0, 25).map(n => {
        return `<p>${n.releaseTitle}</p>`
    }).join('')


}

getNotifications()
onLoad()