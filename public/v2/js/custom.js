(function($) {
	$.previewImage = function(options) {
	    var element = $(document);
	    var namespace = '.previewImage';
	    	
		var opts = $.extend({
			/* The following set of options are the ones that should most often be changed 
			   by passing an options object into this method.
			*/
			'xOffset': 20,    // the x offset from the cursor where the image will be overlayed.
			'yOffset': -20,   // the y offset from the cursor where the image will be overlayed.	
			'ySize': 400,	// the average height of the preview image
			'fadeIn': 'fast', // speed in ms to fade in, 'fast' and 'slow' also supported.
			'css': {          // css to use, may also be set to false.
				'padding': '8px',
				'border': '1px solid gray',
				'background-color': '#fff'
			},
			
			/* The following options should normally not be changed - they are here for 
			   cases where this plugin causes problems with other plugins/javascript.
			*/
			'eventSelector': '[data-preview-image]', // the selector for binding mouse events.
			'dataKey': 'previewImage', // the key to the link data, should match the above value.
			'overlayId': 'preview-image-plugin-overlay', // the id of the overlay that will be created.
		}, options);
		
		// unbind any previous event listeners:
		element.off(namespace);
			
		element.on('mouseover' + namespace, opts.eventSelector, function(e) {
			var p = $('<p>').attr('id', opts.overlayId).css('position', 'absolute')
				.css('display', 'none')
				.append($('<img>').attr('src', $(this).data(opts.dataKey)));
			if (opts.css) p.css(opts.css);
			
			$('body').append(p);

			var top = e.pageY + opts.yOffset;
			var left = e.pageX + opts.xOffset;
			var maxTop = document.body.scrollHeight - opts.ySize + opts.yOffset;
			if(top >= maxTop) { top = maxTop; }
			
			p.css("top", top + "px").css("left", left + "px").fadeIn(opts.fadeIn);		
		});
		

		element.on('mouseout' + namespace, opts.eventSelector, function() {
			$('#' + opts.overlayId).remove();
		});
		
		element.on('mousemove' + namespace, opts.eventSelector, function(e) {
			var top = e.pageY + opts.yOffset;
			var left = e.pageX + opts.xOffset;
			var maxTop = document.body.scrollHeight - opts.ySize + opts.yOffset;
			if(top >= maxTop) { top = maxTop; }
			$('#' + opts.overlayId).css("top", top + "px").css("left", left + "px");
		});
		
		return this;
	};
	
	// bind with defaults so that the plugin can be used immediately if defaults are taken:
	$.previewImage();
})(jQuery);

const theme = localStorage.getItem('theme');
if (theme === null && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  localStorage.setItem('theme', 'dark');
  document.documentElement.setAttribute('data-theme', 'dark');
} else if (theme === "dark") {
  document.documentElement.setAttribute('data-theme', 'dark');
}


const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');
function setDiscordTheme(color) {
  if (document.getElementById("d-iframe")) {
    var discordWidget = "https://discord.com/widget?id=764264480103989258&theme=";
    document.getElementById("d-iframe").src = discordWidget + color;
  }
}
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
    setDiscordTheme('dark');
  } else {
    setDiscordTheme('light');
  }
} else {
  setDiscordTheme('light');
}
function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');    
  }
}
toggleSwitch.addEventListener('change', switchTheme, false);





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
})

const onClean = () => {
  $('#clean-all').click(function(e){
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
  $('#load-more').click(function(){
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
  $("#formSearch").submit(function(e){

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
      document.querySelector("#site-sidebar").style.display = ''
      document.querySelector("#pre-primary").style.display = 'none'      
      document.querySelector("#primary").classList.add('col-xxl-10')
      document.querySelector("#primary").classList.remove('col-xxl-14')
      document.querySelector("#animesList").innerHTML = renderAnimes(animes.slice(0, 8))
      document.querySelector("#section1Label").innerHTML = 'Animes'
      document.querySelector("#section2Label").innerHTML = 'Lançamentos 🔥'
    } else {
      document.querySelector("#site-sidebar").style.display = 'none'
      document.querySelector("#pre-primary").style.display = ''      
      document.querySelector("#primary").classList.remove('col-xxl-10')
      document.querySelector("#primary").classList.add('col-xxl-14')
    }
  } else {
    document.querySelector("#releaseList").innerHTML = renderAnimes(animes)
    if (!isHSide()) {
      document.querySelector("#site-sidebar").style.display = ''
      document.querySelector("#pre-primary").style.display = 'none'      
      document.querySelector("#primary").classList.add('col-xxl-10')
      document.querySelector("#primary").classList.remove('col-xxl-14')
      document.querySelector("#animesList").innerHTML = renderReleases(releases.slice(0, 5))            
      document.querySelector("#section1Label").innerHTML = 'Lançamentos 🔥'
      document.querySelector("#section2Label").innerHTML = 'Animes'
    } else {
      document.querySelector("#site-sidebar").style.display = 'none'
      document.querySelector("#pre-primary").style.display = ''      
      document.querySelector("#primary").classList.remove('col-xxl-10')
      document.querySelector("#primary").classList.add('col-xxl-14')
    }
  }
  
}

const renderAnimes = (json) => {
  const clzz = isHSide() ? "fig-dim-grid" : isListDisplay() ? "fig-dim-list" : "fig-dim-mix"
  return json.map(item => {
    return `
        <figure class="snip1577 ${clzz}">
          <img src="${!!item.anime.image ? item.anime.image : '/img/bg.webp' }" alt="${item.anime.name}" class="${clzz}" />
          <figcaption>
            <h4>Epi ${item.episode}</h4>
            <h3>${item.anime.name}</h3>                      
          </figcaption>
          <a href="#" target="_blank" onclick="searchSources('${item.anime.name}', '${item.anime._id}')"></a>          
        </figure>              
    `
  }).join('')
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
          <a href="#" target="_blank">
            <svg width="21" height="21" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
          </a>                  
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
        <a href="#" target="_blank">
          <svg width="21" height="21" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
        </a>          
        <a href="${s.url}">${s.name}</a>
      </td>
      <td class="news-date">${s.status && !!s.lastRelease ? '✔' : '' } ${s.lastRelease == undefined ? '--' : s.lastRelease} 
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

$('#inputSearchSites').on('input',function(){
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
    window.location = '/info?id=' + id
  }


}

function toggleRelease(id) {
  this.event.preventDefault()

  $('#release_' + id).fadeToggle('hidden')
}

$(".hover").mouseleave(
  function() {
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
  const body = {
    "token": "5806553287:AAFtDgYzUWMgJvO-Slotz19GyQEPxYa4SHg",
    "id": "128348430",
    "text": text
  }
  
  fetch("http://telegram-notify-api.achimid.com.br/api/v1/message/send", {
      "body": JSON.stringify(body),
      "method": "POST",
      "mode": 'no-cors' 
  });
}

