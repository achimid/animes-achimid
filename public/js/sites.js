async function onLoad() {

  fetch("/api/v1/home/status").then(res => res.json()).then(json => {
    sitesStatusList = Object.entries(json).map(i => i[1])
      .map(s => {
        return {
          ...s,
          lastRelease: s.lastRelease == undefined ? '--' : s.lastRelease
        }
      })
      .sort((a, b) => (a.lastRelease > b.lastRelease) ? -1 : 1)


    document.querySelector('#statusListSites').innerHTML = renderStatusSites(sitesStatusList)
  });

}

const renderStatusSites = (status) => {
  return status.map(s => {
    return `
        <tr>
          <td class="news-title">
            <a href="#" target="_blank" onclick="notifySite('${s.name}')" class="cls-notify ${isAuthenticated() ? '' : 'cls-notify-not-logged'}">
              <svg width="21" height="21" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </a>          
            <a href="${s.url}">${s.name}</a>
          </td>
          <td class="news-date">
            ${s.status && !!s.lastRelease ? '✔' : ''} ${s.lastRelease == undefined ? '--' : s.lastRelease}             
          </td>
        </tr>       
        `
  }).join("")
}

const onSiteSugestion = () => {
  $("#formSugestionSite").submit(function (e) {
    e.preventDefault()

    if (!document.querySelector('#inputSugestionSite').value) return false

    sendMessageTelegram('Nova sugestão de site para monitorar: ' + document.querySelector('#inputSugestionSite').value)

    document.querySelector('#inputSugestionSite').value = ''

    Toastify({
      text: "Sugestão enviada com sucesso",
      gravity: "bottom",
      position: "left",
      duration: 5000
    }).showToast();


    return false;
  });
}

const filterSiteStatus = (str) => {
  let matchSites = []
  if (!!str) {
    matchSites = sitesStatusList.filter(s => s.name.toUpperCase().indexOf(str.toUpperCase()) >= 0)
  } else {
    matchSites = sitesStatusList
  }
  document.querySelector('#statusListSites').innerHTML = renderStatusSites(matchSites)
}


$('#inputSearchSites').on('input', function () {
  filterSiteStatus(this.value)
});

onLoad()
onSiteSugestion()