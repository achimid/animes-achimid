const posts = []

const episodes = [...document.querySelectorAll('.animation-2 article')].reverse()
for (let i = 0; i < episodes.length; i++) {
    const $episode = episodes[i]

    const url = $episode.querySelector('.data a').href
    const anime = $episode.querySelector('.data span.serie').innerText
    const episode = parseInt($episode.querySelector('.data span').innerText.split('E')[1].split(' ')[0].match(/\d+/g))
    const title = `${anime} - Episódio ${episode}`
    
    const post = {
        from: "Animes Up",
        url,
        title,
        anime,
        episode,
    }
    
    console.log(post)
    posts.push(post)
    
}

posts
