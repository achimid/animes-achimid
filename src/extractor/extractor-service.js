const fs = require('fs')
const path = require('path')
const cookiesService = require('./cookies/cookies-service')
const statusService = require('./../status/status-service')
const fetch = require('node-fetch')

const readScript = (file) => {
    const script = fs.readFileSync(path.join(__dirname, `./scripts/${file}`), 'utf8')
    
    if (process.env.NODE_ENV == 'production') return script

    return script.replace(new RegExp("https://animes.achimid.com.br/", 'g'), "http://192.168.0.101:8081")
}

const getSubscribers = () => {
    return {
        slow: [
            
            { useProxy: false, skipImage: false, url: "https://www.crunchyroll.com/", script: readScript("crunchyroll-script.js"), name: "Crunchyroll"},
            { useProxy: false, skipImage: true, url: "https://www.anitube.vip/", script: readScript("anitubevip-script.js"), name: "Anitube VIP"},
            { useProxy: false, skipImage: false, url: "https://centraldeanimes.xyz/", script: readScript("centraldeanimes-script.js"), name: "Central de Animes"},
            { useProxy: false, skipImage: true, url: "https://www.anroll.net/lancamentos", script: readScript("animesroll-script.js"), name: "AnimesRoll"},
            { useProxy: false, skipImage: false, url: "https://animesgames.cc/lancamentos", script: readScript("animesgames-script.js"), name: "Animes Games"},
            { useProxy: false, skipImage: false, url: "https://animesflix.net/", script: readScript("animesflix-script.js"), name: "Animes Flix"},
            { useProxy: false, skipImage: true, url: "https://animesonlinecc.to/episodio/", script: readScript("animesonlinecc-script.js"), name: "Animes Online CC"},
            // { useProxy: false, skipImage: true, url: "https://subanimes.love/lista-de-episodios/", script: readScript("subanimes-script.js"), name: "Sub Animes"},            
            
        ],
        medium: [
            { useProxy: false, skipImage: false, url: "https://goyabu.to/lancamentos", script: readScript("goyabu-script.js"), name: "Goyabu"},            
            { useProxy: false, skipImage: true, url: "https://animesbr.tv/episodios/", script: readScript("animesbr-script.js"), name: "Animes BR"},            
            { useProxy: false, skipImage: true, url: "https://animesonline.red/", script: readScript("animesonline-red-script.js"), name: "Animes Online Red"},            
            { useProxy: false, skipImage: true, url: "https://www.hinatasoul.com/", script: readScript("hinata-soul.js"), name: "Hinata Soul"},                        
            { useProxy: false, skipImage: true, url: "https://animeq.blog/", script: readScript("animeq-script.js"), name: "Anime Q"},           
            { useProxy: false, skipImage: true, url: "https://animesonline.cloud/", script: readScript("animesonlinecloud-script.js"), name: "Animes Online Cloud"},           
            { useProxy: false, skipImage: true, url: "https://animesdrive.blog/", script: readScript("animesdrive-script.js"), name: "Animes Drive"},           
            { useProxy: false, skipImage: false, url: "https://www.animesup.info/", script: readScript("animesup-info-script.js"), name: "Animes Up"},
        ],
        fast: [
            { useProxy: false, skipImage: true, url: "https://nyaa.si/?f=0&c=0_0&q=%5BErai-raws%5D+%5B1080p%5D%5BMultiple+Subtitle%5D", script: readScript("erairaws-script.js"), name: "Erai-raws (Nyaa)"},
            { useProxy: false, skipImage: true, url: "https://nyaa.si/?f=0&c=0_0&q=%5BErai-raws%5D+%5B1080p+CR+WEB-DL", script: readScript("erairaws-script.js"), name: "Erai-raws (Nyaa)"},
            { useProxy: false, skipImage: false, url: "https://subsplease.org/", script: readScript("subsplease-script.js"), name: "Subs Please (ENG)"},
            { useProxy: false, skipImage: true, url: "https://darkmahou.org/", script: readScript("darkanimes-script.js"), name: "Dark Animes"},            
            { useProxy: false, skipImage: false, url: "https://www.goanimes.vip/", script: readScript("goanimes-script .js"), name: "Go Animes"},
            { useProxy: false, skipImage: true, url: "https://animefire.plus/", script: readScript("animefire-script.js"), name: "Anime Fire"},            
            { useProxy: false, skipImage: true, url: "https://q1n.net/", script: readScript("bakashi-script.js"), name: "Bakashi"},
            
            
        ]
    }
    return [
        // { useProxy: false, skipImage: true, url: "https://ninjinanime.com/", script: readScript("ninjinanimes-script.js"), name: "Ninjin Anime (ESP)"},
        // { useProxy: false, skipImage: true, url: "https://betteranime.net/ultimosAdicionados", script: readScript("betteranime-script.js"), name: "Better Anime"},            
        // { useProxy: false, skipImage: true, url: "https://sakuraanimes.com/home?categoria=1", script: readScript("animeshouse-script.js"), name: "Sakura Animes"}, 
        
        // { useProxy: false, skipImage: false, url: "https://animeszone.net/epex00/", script: readScript("animeszone-script.js"), name: "Animes Zone"},
        // { useProxy: false, skipImage: true, url: "https://www.anbient.com/", script: readScript("anbient-script.js"), name: "Anbient"},
        // { useProxy: false, skipImage: true, url: "https://alqanime.net/", script: readScript("alqanime-script.js"), name: "Alqanime"},                       
        // { useProxy: false, skipImage: false, url: "https://centralanimestk.net/", script: readScript("centralanimes-script.js"), name: "Central Animes TK"},
        // { useProxy: false, skipImage: false, url: "https://animesup.vc/", script: readScript("animesup-script.js"), name: "Animes Up"},
        // { useProxy: false, skipImage: false, url: "https://animeshouse.net/", script: readScript("animeshouse-script.js"), name: "Animes House"},
        // { useProxy: false, skipImage: true, url: "https://animetvonline.cx/", script: readScript("animetv-script.js"), name: "Anime TV"},
        // { useProxy: false, skipImage: true, url: "https://rine.cloud/", script: readScript("rinecloud-script.js"), name: "Rine Cloud"},
        // { useProxy: false, skipImage: false, url: "https://www.animestc.net", script: readScript("animestelecine-script.js"), name: "Animes Telecine"},
        // { useProxy: false, skipImage: true, url: "https://saikoanimes.net/episodios-legendados-em-exibicao/", script: readScript("saikoanimes-script.js"), name: "Saiko Animes"},            
        // { useProxy: false, skipImage: true, url: "https://animesync.org/episodio/", script: readScript("animesync-script.js"), name: "Anime Sync"},
        // { useProxy: false, skipImage: true, url: "https://animes.vision/", script: readScript("animesvision-script.js"), name: "Animes Vision"},
        // { useProxy: false, skipImage: true, url: "https://animesonline.nz/", script: readScript("animesonlinenz-script.js"), name: "Animes Online NZ"},
        // { useProxy: false, skipImage: false, url: "https://anitora.ru/", script: readScript("anitora-script.js"), name: "AniTora"},
    ]
} 

const callExecutor = (sub) => {
    const body = {
        "url": sub.url,
        "script": sub.script,
        "callbackUrl": process.env.CALLBACK_URL,
        "ref": sub.name,
        "config": {
          "bypassCSP": true,
          "skipImage": sub.skipImage
        }
      };

    fetch('https://puppeteer-executor.achimid.com.br/api/v1/execution/', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => console.log('Extração adicionada a fila ', json.id))
}

const executionSlow = async () => {
    const subs = getSubscribers().slow    
    for (let i = 0; i < subs.length; i++) {
        callExecutor(subs[i])
    }
}

const executionMedium = async () => {
    const subs = getSubscribers().medium
    for (let i = 0; i < subs.length; i++) {
        callExecutor(subs[i])
    }
}

const executionFast = async () => {
    const subs = getSubscribers().fast    
    for (let i = 0; i < subs.length; i++) {
        callExecutor(subs[i])
    }
}

const execute = async () => {
    if (process.env.ENABLE_EXTRACTOR === 'true') {
        await executionSlow()
        await executionMedium()
        await executionFast()
    }
}

const start = async () => {
    if (process.env.ENABLE_EXTRACTOR === 'true') {
        await execute()
        setInterval(executionSlow, 1000 * 60 * 12)
        setInterval(executionMedium, 1000 * 60 * 7)
        setInterval(executionFast, 1000 * 60 * 3)
    }
}


module.exports = {
    start,
    execute
}