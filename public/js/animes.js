function onLoad() {
    fetch("/api/v1/home/list/names").then(res => res.json()).then(animes => {
        console.log(animes)
        animes.sort((a, b) => {				
            if (a.anime.name < b.anime.name) return -1;
            if (a.anime.name > b.anime.name) return 1;
            return 0;
        })			
        console.log(animes)
        let last
        document.querySelector('.all-shows').innerHTML = animes.map(a => {
            let html = ''
            if (last != a.anime.name[0]) {
                html += `<h3 class="alphanum-category">${a.anime.name[0].toUpperCase()}</h3>`
            }
            
            html += `<div class="all-shows-link">
                        <a href="/info?id=${a.anime._id}" data-preview-image="${a.anime.image}" title="${a.anime.name}">${a.anime.name}</a>
                    </div>`

            last = a.anime.name[0]

            return html
        }).join('')
        
    })
}

onLoad()