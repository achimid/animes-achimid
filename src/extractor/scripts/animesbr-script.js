const posts = []

const episodes = [...document.querySelectorAll('article')].slice(0, 20).reverse()
for (let i = 0; i < episodes.length; i++) {
    const $episode = episodes[i]

    const url = $episode.querySelector('a').href
    const anime = $episode.querySelector('.eptitle').innerText.split('Episódio')[0].trim()
    const episode = parseInt($episode.querySelector('.eptitle').innerText.split('Episódio')[1].trim().match(/\d+/g))
    const title = `${anime} - Episódio ${episode}`

    const languages = ['PT-BR']
    const isDub = url.toLowerCase().indexOf('-dub') >= 0

    
    const post = {
        from: "Animes BR",
        url,
        title,
        anime,
        episode,
        languages,
        isDub
    }
    console.log(post)
    posts.push(post)        
}

posts