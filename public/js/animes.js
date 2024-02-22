function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function onLoad() {
    fetch("/api/v1/home/list/names").then(res => res.json()).then(animesRaw => {
        const animes = animesRaw.map(a => {
            return {
                anime: {
                    ...a.anime,
                    name: capitalizeFirstLetter(a.anime.name)
                }
            }
        })

        animes.sort((a, b) => {				
            if (a.anime.name < b.anime.name) return -1;
            if (a.anime.name > b.anime.name) return 1;
            return 0;
        })			
        
        let last
        document.querySelector('.all-shows').innerHTML = animes.map(a => {
            let html = ''
            if (last != a.anime.name[0]) {
                html += `<h3 class="alphanum-category">${a.anime.name[0].toUpperCase()}</h3>`
            }
            
            html += `<div class="all-shows-link">
                        <a href="/anime/${a.anime._id}" data-preview-image="${a.anime.image}" title="${a.anime.name}">${a.anime.name}</a>
                    </div>`

            last = a.anime.name[0]

            return html
        }).join('')
        
    })
}

onLoad()