const posts = []

const episodes = [...document.querySelectorAll('article')].reverse()
for (let i = 0; i < episodes.length; i++) {
    const $episode = episodes[i]

    const url = $episode.querySelector('a').href
    const anime = $episode.querySelector('.epiAnime').innerText.replace('Assistir', '')
    const episode = parseInt($episode.querySelector('.epiNumber').innerText.match(/\d+/g))
    const title = `${anime} - Episódio ${episode}`
    
    const post = {
        from: "Sub Animes",
        url,
        title,
        anime,
        episode,
    }
    console.log(post)
    posts.push(post)        
}

posts