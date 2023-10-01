const posts = []

const episodes = [...document.querySelectorAll('.items.full > .item')].reverse()
for (let i = 0; i < episodes.length; i++) {
    const $episode = episodes[i]

    const url = $episode.querySelector('.data a').href
    const anime = $episode.querySelector('.serie').innerText
    const episode = parseInt($episode.querySelector('.data a').innerText.match(/\d+/g))
    const title = `${anime} - Episódio ${episode}`
    const mirrorOnline = url
    
    const post = {
        from: "Go Animes",
        url,
        title,
        anime,
        episode,
        data: {
            mirrors: [
                {
                    description: "Online",
                    url: mirrorOnline
                }
            ].filter(m => m.url)
        }
    }
    
    console.log(post)
    posts.push(post)

}


posts