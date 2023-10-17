const $progress = document.querySelector('.progress')
const $sPeers = document.querySelector('#sPeers')
const $sDownload = document.querySelector('#sDownloaSpeed')
const $sUpload = document.querySelector('#sUploadSpeed')
const $sMagnet = document.querySelector('#sMagnet')
const $sDownloadLink = document.querySelector('#sDownloadLink')
const $modalVideo = $("#modal-video")
const getVideo = () => document.querySelector('video')


const client = new WebTorrent()

let intervalCurrent = null
let torrentIdCurrent = null
const torrentIdDefault = 'magnet:?xt=urn:btih:f038bb27c391be7a060c19bb479ea9848997f32b&dn=%5BAniFan%5D_%5BAnimesATC%5D_Overlord_IV_-_07_(1080p).mp4&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2810%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=https%3A%2F%2Fopentracker.i2p.rocks%3A443%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fchouchou.top%3A8080%2Fannounce&tr=https%3A%2F%2Ftracker.nanoha.org%3A443%2Fannounce&tr=https%3A%2F%2Ftracker.lilithraws.org%3A443%2Fannounce&tr=http%3A%2F%2Fvps02.net.orel.ru%3A80%2Fannounce&tr=http%3A%2F%2Ftracker3.ctix.cn%3A8080%2Fannounce&tr=http%3A%2F%2Ftracker.mywaifu.best%3A6969%2Fannounce&tr=udp%3A%2F%2Fzecircle.xyz%3A6969%2Fannounce&tr=udp%3A%2F%2Fyahor.ftp.sh%3A6969%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337'



$modalVideo.on('hide.bs.modal', function() {
    try { clearInterval(intervalCurrent) } catch (error) {}
    try { getVideo().remove() } catch (error) {}
    try { client.remove(torrentIdCurrent) } catch (error) {}

    torrentIdCurrent = null
    intervalCurrent = null
});


client.on('error', function (err) {
    console.error('ERROR: ' + err.message)
})


function addTorrent(torrentId = torrentIdDefault) {
    torrentIdCurrent = torrentId
    
    console.log('Adding ' + torrentIdCurrent)

    $sMagnet.href = torrentIdCurrent
    client.add(torrentIdCurrent, onTorrent)        
    $modalVideo.modal()

    $('#sDownloadLink').hide()
    $('.info-torrent').show()
}

function onTorrent(torrent) {
    console.log('Got torrent metadata!')
    console.log(
        'Torrent info hash: ' + torrent.infoHash + ' ' +
        '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> ' +
        '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
    )
    
    
    intervalCurrent = setInterval(() => progress(torrent), 2000)

    torrent.on('done', function () {
        $sDownloadLink.href = torrent.torrentFileBlobURL           
        $sDownloadLink.download = torrent.files[0].name
        
        torrent.files[0].getBlobURL((err, url) => { $sDownloadLink.href = url })
        $('#sDownloadLink').show()
        $('.info-torrent').hide()
    })

    torrent.files.filter(({ name })  => name.endsWith('.mp4')).forEach(function (file) {
        file.appendTo('.video')
        file.getBlobURL(function (err, url) {
            if (err) return log(err.message)
            console.log('File done.')
            console.log('<a href="' + url + '">Download full file: ' + file.name + '</a>')            
        })
    })
}

function progress(torrent) {    
    const progress = (torrent.progress * 100).toFixed(1)
    const download = torrent.downloadSpeed
    const upload = torrent.uploadSpeed
    const peers = torrent.numPeers

    $progress.innerHTML = `<div class="progress-bar" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%</div>`
    $sPeers.innerHTML = peers
    $sDownload.innerHTML = prettyBytes(download) + '/s'
    $sUpload.innerHTML = prettyBytes(upload) + '/s'
}

function prettyBytes(num) {
    const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const neg = num < 0
    if (neg) num = -num
    if (num < 1) return (neg ? '-' : '') + num + ' B'
    const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
    const unit = units[exponent]
    num = Number((num / Math.pow(1000, exponent)).toFixed(2))
    return (neg ? '-' : '') + num + ' ' + unit
}

