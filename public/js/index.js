

const toggleDispĺayPosition = document.querySelector('#checkboxInverter');
toggleDispĺayPosition.checked = isListDisplay();
function switchDisplayPosition(e) {
  if (e.target.checked) {
    localStorage.setItem('dispĺayPosition', 'lista');
    loadReleases()
  } else {
    localStorage.setItem('dispĺayPosition', 'imagem');
    loadReleases()
  }
}
toggleDispĺayPosition.addEventListener('change', switchDisplayPosition, false);


const toggleHSide = document.querySelector('#checkboxHSide');
toggleHSide.checked = isHSide();
function switchHSide(e) {
  if (e.target.checked) {
    localStorage.setItem('HSide', 'true');
    loadReleases()
    loadSchedule()
    loadStatusSites()
  } else {
    localStorage.setItem('HSide', 'false');
    loadReleases()
    loadSchedule()
    loadStatusSites()
  }
}
toggleHSide.addEventListener('change', switchHSide, false);



$(document).ready(function () {
  loadReleases()
  loadSchedule()
  loadStatusSites()
  onSearch()
  onLoadMore()
  onClean()
  onSiteSugestion()
})

const onClean = () => {
  $('#clean-all').click(function (e) {
    e.preventDefault()

    fetch("/api/v1/home")
      .then(res => res.json())
      .then(json => {
        renderJson(json)
        document.querySelector('#inputSearch').value = ""
      })
  })
}

const onLoadMore = () => {
  $('#load-more').click(function () {
    fetch("/api/v1/home/search?q=" + document.querySelector('#inputSearch').value + "&skip=" + (parseInt(document.querySelectorAll('#releaseList tr.new').length) + parseInt(document.querySelectorAll('#releaseList figure').length)))
      .then(res => res.json())
      .then(json => {
        if (isListDisplay()) {
          document.querySelector("#releaseList").innerHTML += renderReleases(json)
        } else {
          document.querySelector("#releaseList").innerHTML += renderAnimes(json)
        }
      })
  })
}

const onSearch = () => {
  $("#formSearch").submit(function (e) {

    fetch("/api/v1/home/search?q=" + document.querySelector('#inputSearch').value)
      .then(res => res.json())
      .then(renderJson)

    return false;
  });
}

const renderJson = (json) => {

  const animesListDistinct = json
    .filter((obj, index) => {
      return index === json.findIndex(o => obj.anime.name === o.anime.name);
    })

  render(json, animesListDistinct)
}

const loadReleases = () => {
  fetch("/api/v1/home")
    .then(res => res.json())
    .then(renderJson)
    .then(() => document.querySelector('.release-item-time a').click())
}

const render = (releases, animes) => {
  if (isListDisplay()) {
    document.querySelector("#releaseList").innerHTML = renderReleases(releases)
    if (!isHSide()) {
      layoutChangeSHide()
      document.querySelector("#animesList").innerHTML = renderAnimes(animes.slice(0, 8))
      document.querySelector("#section1Label").innerHTML = 'Animes'
      document.querySelector("#section2Label").innerHTML = 'Lançamentos 🔥'
    } else {
      layoutChangeSHide()
    }
  } else {
    document.querySelector("#releaseList").innerHTML = renderAnimes(animes)
    if (!isHSide()) {
      layoutChangeSHide()
      document.querySelector("#animesList").innerHTML = renderReleases(releases.slice(0, 5))
      document.querySelector("#section1Label").innerHTML = 'Lançamentos 🔥'
      document.querySelector("#section2Label").innerHTML = 'Animes'
    } else {
      layoutChangeSHide()
    }
  }

}

function layoutChangeSHide() {
  if (!isHSide()) {
    document.querySelector("#site-sidebar").style.display = ''
    document.querySelector("#pre-primary").style.display = 'none'
    document.querySelector("#primary").classList.add('col-xxl-10')
    document.querySelector("#primary").classList.remove('col-xxl-14')
    document.querySelector("#primary").classList.add('col-xl-10')
    document.querySelector("#primary").classList.remove('col-xl-14')
    document.querySelector("#primary").classList.add('col-lg-10')
    document.querySelector("#primary").classList.remove('col-lg-14')
  } else {
    document.querySelector("#site-sidebar").style.display = 'none'
    document.querySelector("#pre-primary").style.display = ''
    document.querySelector("#primary").classList.remove('col-xxl-10')
    document.querySelector("#primary").classList.add('col-xxl-14')
    document.querySelector("#primary").classList.remove('col-xl-10')
    document.querySelector("#primary").classList.add('col-xl-14')
    document.querySelector("#primary").classList.remove('col-lg-10')
    document.querySelector("#primary").classList.add('col-lg-14')
  }
}


const renderAnimes = (json) => {
  const clzz = isHSide() ? "fig-dim-grid" : isListDisplay() ? "fig-dim-list" : "fig-dim-mix"
  return json.map(item => {
    return `
          <figure class="snip1577 ${clzz}">
            <img src="${!!item.anime.image ? item.anime.image : '/img/bg.webp'}" alt="${item.anime.name}" class="${clzz}" />
            <figcaption>
              <h4>Epi ${item.episode}</h4>
              <h3>${item.anime.name}</h3>                      
            </figcaption>
            <a href="/info?id=${item.anime._id}" target="_blank" onclick="searchSources('${item.anime.name}', '${item.anime._id}')"></a>          
          </figure>              
      `
  }).join('')
}

const renderBell = (item) => {
  if (!getUser().animeToNotify.includes(item.anime._id)) {
    return `
      <a href="#" target="_blank" onclick="notifyAnime('${item.anime._id}')"  class="cls-notify ${isAuthenticated() ? '' : 'cls-notify-not-logged'}">
        <svg width="21" height="21" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
      </a>  
    `
  } else {
    return `
    <a href="#" target="_blank" onclick="notifyAnimeCancel('${item.anime._id}')"  class="cls-notify ${isAuthenticated() ? '' : 'cls-notify-not-logged'}">      
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m.5 13.5l13-13M6 13.5h2M8.73.84A4.51 4.51 0 0 0 2.5 5v2.5M3 11h10.5a2 2 0 0 1-2-2V5a4.42 4.42 0 0 0-.5-2"/></svg>
    </a>  
  `
  }
}

const renderReleases = (json) => {
  return json.map(item => {
    return `
      <tr class="new">
          <td class="release-item">            
              <a href="/info?id=${item.anime._id}" data-preview-image="${item.anime.image}">${item.title.split(' - ')[1].substring(0, 60)}</a>                      
          </td>                                                                            
          <td class="release-item-time">
            <a href="#" target="_blank" onclick="toggleRelease('${item._id}')" class="badge badge-front badge-new hidden-xs">${item.title.split(' - ')[0]}</a>
            ${renderBell(item)}     
          </td>                                                                            
        </tr>
      <tr>
        <td id="release_${item._id}" class="hidden resourceRow">   
          ${item.sources.map(source => {
      return `<a href="${source.url}" class="badge badge-front badge-new">${source.title}</a>`
    }).join('')}        
        </td>
      </tr>
      `
  }).join('')
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
        <td class="news-date">${s.status && !!s.lastRelease ? '✔' : ''} ${s.lastRelease == undefined ? '--' : s.lastRelease} 
          <a href="#" target="_blank" onclick="searchSources('${s.name}')">
            <svg  width="21" height="21" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path fill="var(--ci-primary-color, currentColor)" d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z" class="ci-primary"/> </svg>
          </a>
        </td>
      </tr>       
      `
  }).join("")
}

const loadStatusSites = () => {
  if (isHSide()) return

  fetch("/api/v1/home/status", {
    "headers": { "Content-Type": "application/json" },
    "method": "GET",
    "mode": "cors"
  }).then(res => res.json()).then(json => {
    sitesStatusList = Object.entries(json).map(i => i[1])
      .map(s => {
        return {
          ...s,
          lastRelease: s.lastRelease == undefined ? '--' : s.lastRelease
        }
      })
      .sort((a, b) => (a.lastRelease > b.lastRelease) ? -1 : 1)



    document.querySelector('#statusListSites').innerHTML = renderStatusSites(sitesStatusList.slice(0, 10))
  });
}

$('#inputSearchSites').on('input', function () {
  console.log(this.value)
  filterSiteStatus(this.value)
});

const filterSiteStatus = (str) => {
  let matchSites = []
  if (!!str) {
    matchSites = sitesStatusList.filter(s => s.name.toUpperCase().indexOf(str.toUpperCase()) >= 0).slice(0, 10)
  } else {
    matchSites = sitesStatusList.slice(0, 10)
  }
  document.querySelector('#statusListSites').innerHTML = renderStatusSites(matchSites)
}

function searchSources(s, id) {
  this.event.preventDefault()

  if (!isHSide()) {
    document.querySelector('#inputSearch').value = s
    $('#formSearch').trigger("submit")
  } else {
    if (this.event.ctrlKey) {
      window.open('/info?id=' + id, '_blank').focus();
    } else {
      window.location = '/info?id=' + id
    }
  }


}

function toggleRelease(id) {
  this.event.preventDefault()

  $('#release_' + id).fadeToggle('hidden')
}

$(".hover").mouseleave(
  function () {
    $(this).removeClass("hover");
  }
);

function isListDisplay() {
  return localStorage.getItem('dispĺayPosition') === "lista"
}

function isHSide() {
  return localStorage.getItem('HSide') === "true"
}


const loadSchedule = () => {
  if (isHSide()) return

  fetch("/api/v1/home/schedule", {
    "headers": { "Content-Type": "application/json" },
    "method": "GET",
    "mode": "cors"
  }).then(res => res.json())
    .then(json => {
      document.querySelector('#schedule-table').innerHTML = renderSchedule(json.schedule)
    });
}

const renderSchedule = (json) => {
  return json.map(d => {
    return `
          <tr class="schedule-widget-item">
            <td class="schedule-widget-show">${d.title}</td>
            <td class="schedule-widget-time">${d.aired ? '✔' : ''} ${d.time}</td>
          </tr>
      `
  }).join('')
}

const sendMessageTelegram = (text) => {
  fetch('/api/v1/home/message/send', {
    method: 'POST',
    body: JSON.stringify({
      message: text
    }),
    headers: { 'Content-Type': 'application/json' }
  })
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