async function extract() {

    const episodes = [...document.querySelectorAll('.releases li') ].reverse()
    for (let i = 0; i < episodes.length; i++) {
        const $episode = episodes[i]

        const url = $episode.querySelector('.season-name a').href
        const prepareAnime = $episode.querySelector('.season-name').innerText.replace('(PORTUGUESE DUB)', '').replace('(JAPANESE AUDIO)', '')
        const anime = prepareAnime[0].toUpperCase() + prepareAnime.substring(1).toLowerCase();
        const episode = parseInt($episode.querySelector('.availability').innerText.match(/\d+/g))
        const title = `${anime} - Episódio ${episode}`
        
        const post = {
            from: "Crunchyroll",
            url,
            title,
            anime,
            episode
        }
        
        console.log(post)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(post);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("https://anifan.com.br/api/v1/integration", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        
    }
}

extract()
