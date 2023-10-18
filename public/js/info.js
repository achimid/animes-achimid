function onLoad() {

    let params = (new URL(document.location)).searchParams
    let id = params.get("id")

    fetch('/api/v1/anime-info/show/' + id).then(res => res.json()).then(anime => {
        document.title = (anime.name || 'Anime Info') + ' – Animes Achimid'
        document.querySelector('#image').src = anime.image
        document.querySelector('#description').innerHTML = anime.description || '...'
        document.querySelector('.entry-title').innerHTML = anime.name || '...'
    })

    fetch("/api/v1/home/anime/" + id).then(res => res.json()).then(releases => {
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
