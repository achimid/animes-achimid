function renderAnimeInfo() {
    let params = (new URL(document.location)).searchParams
    let id = params.get("id")

    fetch('/api/v1/anime-info/show/' + id).then(res => res.json()).then(anime => {
        document.title = (anime.name || 'Anime Info') + ' – Animes Achimid'
        document.querySelector('#image').src = anime.image
        document.querySelector('#description').innerHTML = anime.description || '...'
        document.querySelector('.entry-title').innerHTML = anime.name || '...'

        if (!getUser().animeToNotify.includes(id)) {
            document.querySelector('.entry-header').innerHTML = `
            <a href="#" target="_blank" onclick="notifyAnime(this, '${anime._id}')" class="cls-notify" title="Gostaria de ser notificado quando houver um novo lançamento!">
                <svg width="30" height="30" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </a>  ` + document.querySelector('.entry-header').innerHTML 
        } else {
            document.querySelector('.entry-header').innerHTML = `
            <a href="#" target="_blank" onclick="notifyAnimeCancel(this, '${anime._id}')" class="cls-notify" title="Gostaria de ser não ser mais notificado!">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m.5 13.5l13-13M6 13.5h2M8.73.84A4.51 4.51 0 0 0 2.5 5v2.5M3 11h10.5a2 2 0 0 1-2-2V5a4.42 4.42 0 0 0-.5-2"/></svg>
            </a>  ` + document.querySelector('.entry-header').innerHTML 
        }
    })
}

function onLoad() {

    
    renderAnimeInfo()
    
    let params = (new URL(document.location)).searchParams
    let id = params.get("id")

    fetch("/api/v1/home/anime/" + id)
        .then(res => res.json())
        .then(prepareAdmin)
        .then(releases => {
        document.querySelector('#show-release-table').innerHTML = releases.map(r => {
            return `<tr class="new">
                        <td class="show-release-item"><label class="episode-title">${r.title}</label>
                            <div class="download-links">
                                ${r.sources.map(s => {
                                    return `<a href="${s.url}">
                                                <span class="badge">${s.title}</span>
                                            </a>`
                                }).join('')}
                            </div>
                        </td>							
                    </tr>`
        }).join('')
    })

}

onLoad()
