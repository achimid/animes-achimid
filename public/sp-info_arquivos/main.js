var $jq = jQuery.noConflict();
function generate_title(show, episode) {
    if (episode == 'Movie') {
        return show;
    } else if (episode.indexOf('-') != -1) {
        return show + ' — ' + episode + ' (Batch)';
    } else {
        return show + ' — ' + episode;
    }
}

function load_schedule(data) {
    $jq('#current-time').append('<span class="wc_time" data-wc-format="MMMM Do YYYY, HH:mm:ss" data-wc-timezone="'+data['tz']+'" data-wc-language="en_US"></span>');
    $jq.each(data['schedule'], function(key, val) {
        var page_link = "";
        var preview_image = "https://subsplease.org" + val.image_url;
        if(val.page) {
            page_link = "/shows/" + val.page;
        }
        if(val.aired) {
            $jq('#schedule-table').append(
                '<tr class="schedule-widget-item"><td class="schedule-widget-show"><a title="Go to show" href="' + page_link + '" data-preview-image="' + preview_image + '">' + val.title + '</a></td><td class="schedule-widget-time">✔ ' + val.time + '</td></tr>'
            );
        } else {
            $jq('#schedule-table').append(
                '<tr class="schedule-widget-item"><td class="schedule-widget-show"><a title="Go to show" href="' + page_link + '" data-preview-image="' + preview_image + '">' + val.title + '</a></td><td class="schedule-widget-time">' + val.time + '</td></tr>'
            );
        }
    });
}
function load_releases(data) {
    $jq.each(data, function(key, val) {
        var ep_badge = "";
        var new_row = "";
        var page_link = "";
        var preview_image = "https://subsplease.org" + val.image_url;
        var title = generate_title(val.show, val.episode);
        if(val.page) {
            page_link = "/shows/" + val.page;
        }
        if(val.time == "New") {
            $jq.each(val['downloads'], function(key, val) {
                ep_badge += '<a href="' + val.magnet + '"><span class="badge badge-front badge-new">'+ val.res + 'p</span></a>';
            });
            xdcc_link = 'https://subsplease.org/xdcc/?search=' + val.xdcc;
            ep_badge += '<a href="' + xdcc_link + '"><span class="badge badge-front badge-new hidden-xs">XDCC</span></a>';
            new_row = '<tr class="new"><td class="release-item"><a href="' + page_link + '" data-preview-image="' + preview_image + '">' + title + '</a><div class="badge-wrapper">'+ep_badge+'</div></td><td class="release-item-time"><span title="' + val.release_date + '" class="time-new-badge">' + val.time + '!</span></td></tr>';
        } else {
            $jq.each(val['downloads'], function(key, val) {
                ep_badge += '<a href="' + val.magnet + '"><span class="badge badge-front">'+ val.res + 'p</span></a>';
            });
            xdcc_link = 'https://subsplease.org/xdcc/?search=' + val.xdcc;
            ep_badge += '<a href="' + xdcc_link + '"><span class="badge badge-front hidden-xs">XDCC</span></a>';
            new_row = '<tr><td class="release-item"><a href="' + page_link + '" data-preview-image="' + preview_image + '">' + title + '</a><div class="badge-wrapper">'+ep_badge+'</div></td><td class="release-item-time"><span title="' + val.release_date + '">' + val.time + '</span></td></tr>';
        }
        $jq('#releases-table').append(new_row);
    });
}

function load_shows(data, ep_type) {
    $jq.each(data, function(key, val) {
        var new_row = "";
        var title = generate_title(val.show, val.episode);
        var label_sd = '<label class="links-unrel">SD</label>';
        var label_720 = '<label class="links-unrel">720p</label>';
        var label_1080 = '<label class="links-unrel">1080p</label>';
        var links_sd = '<span class="badge-unrel">Magnet</span><span class="badge-unrel">Torrent</span><span class="badge-unrel">XDCC</span>';
        var links_720 = '<span class="badge-unrel">Magnet</span><span class="badge-unrel">Torrent</span><span class="badge-unrel">XDCC</span>';
        var links_1080 = '<span class="badge-unrel">Magnet</span><span class="badge-unrel">Torrent</span><span class="badge-unrel">XDCC</span>';
        $jq.each(val['downloads'], function(key, val) {
            xdcc_link = 'https://subsplease.org/xdcc/?search=' + val.xdcc;
            if(val.res == '360' || val.res === '480' || val.res === '540') {
                label_sd = '<label class="links">' + val.res + 'p</label>';
                links_sd = '';
                links_sd += '<a href="' + val.magnet + '"><span class="badge">Magnet</span></a>';
                links_sd += '<a href="' + val.torrent + '"><span class="badge">Torrent</span></a>';
                links_sd += '<a href="' + xdcc_link + '"><span class="badge hidden-xs">XDCC</span></a>';
            } else if (val.res == '720') {
                label_720 = '<label class="links">720p</label>';
                links_720 = '';
                links_720 += '<a href="' + val.magnet + '"><span class="badge">Magnet</span></a>';
                links_720 += '<a href="' + val.torrent + '"><span class="badge">Torrent</span></a>';
                links_720 += '<a href="' + xdcc_link + '"><span class="badge hidden-xs">XDCC</span></a>';
            } else {
                label_1080 = '<label class="links">1080p</label>';
                links_1080 = '';
                links_1080 += '<a href="' + val.magnet + '"><span class="badge">Magnet</span></a>';
                links_1080 += '<a href="' + val.torrent + '"><span class="badge">Torrent</span></a>';
                links_1080 += '<a href="' + xdcc_link + '"><span class="badge hidden-xs">XDCC</span></a>';
            }
        });
        if(val.time == "New") {
            new_row = '<tr class="new"><td class="show-release-item"><label class="episode-title">' + title + '</label><div class="download-links" style="display: none;">' + label_sd + links_sd + label_720 + links_720 + label_1080 + links_1080 + '</td><td class="release-item-time"><span title="' + val.release_date + '"class="time-new-badge">' + val.time + '!</span></div></td></tr>'; 
        } else {
            new_row = '<tr class="new"><td class="show-release-item"><label class="episode-title">' + title + '</label><div class="download-links" style="display: none;">' + label_sd + links_sd + label_720 + links_720 + label_1080 + links_1080 + '</td><td class="release-item-time"><span title="' + val.release_date + '">' + val.time + '</span></div></td></tr>';
        }
        if(ep_type == 'episode') {
            $jq('#show-release-table').append(new_row);
        } else {
            $jq('#show-batch-table').append(new_row);
        }
    });
}

$jq(function () {
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //Home page
    if($jq('.frontpage-releases-container').length) {
        $jq.when(
            $jq.getJSON('/api/?f=schedule&h=true&tz=' + timezone),
            $jq.getJSON('/api/?f=latest&tz=' + timezone)
        ).done(function(data1, data2) {
            load_schedule(data1[0]);            
            load_releases(data2[0]);
        });
    }
    //Post
    if($jq('.post').length) {
        $jq.when(
            $jq.getJSON('/api/?f=schedule&h=true&tz=' + timezone)
        ).done(function(data) {
            load_schedule(data);
        });
    }
    //Load more
    $jq('#latest-load-more span').on('click', function() {
        var page = $jq('#latest-load-more').data('page');
        $jq.getJSON('/api/?f=latest&tz=' + timezone + '&p=' + page, function(data) {
                if(JSON.stringify(data).includes('limit_reached')) {
                    $jq('#latest-load-more').html('Please use search or visit the <a href="/shows/"><strong>shows</strong></a> page.');
                } else {
                    load_releases(data);
                    $jq('#latest-load-more').data('page', page + 1);
                }
        });
    });
    //Home page search
    $jq('.search-box').submit(function() { //search
        term = $jq('.search-box-input').val();
        $jq.getJSON('/api/?f=search&tz=' + timezone + '&s=' + term, function(data) { 
            $jq('#releases-table').empty();            
            if(term == "") {
                $jq('#latest-load-more').show();
            } else {
                $jq('#latest-load-more').hide();
            }
            load_releases(data);
        });
        return false;
    });    
    //Show page
    var show = $jq('#show-release-table').attr('sid');
    if(show) {
        $jq.getJSON('/api/?f=show&tz=' + timezone + '&sid=' + show, function(data) {
            if(!$jq.isEmptyObject(data['batch'])) {
                $jq('.series-release').prepend('<h2>Batch [<a href="/2021/01/03/we-care-batches-vrv-and-more/">?</a>]</h2><table id="show-batch-table" cellpadding="0" border="0" cellspacing="0"></table>');
                load_shows(data['batch'], 'batch');
            } 
            if(!$jq.isEmptyObject(data['episode'])) {
                load_shows(data['episode'], 'episode');
            } else {
                $jq('.series-release').append('Currently, there are no episodes available for this show.')
            }
            //Show download link
            $jq('.episode-title').on('click', function() {
                if($jq(this).next().is(":visible")) {
                    $jq(this).next().hide();
                } else {
                    $jq(this).next().show();
                }
            });
        });
    } 


    //Schedule page
    if($jq('#full-schedule-table').length) {
        $jq.when(
            $jq.getJSON('/api/?f=schedule&h=true&tz=' + timezone),
            $jq.getJSON('/api/?f=schedule&tz=' + timezone)
        ).done(function(data1, data2) {
            load_schedule(data1[0]);
            $jq.each(data2[0]['schedule'], function(key, val) {           
                $jq('#full-schedule-table').append(
                    '<tr class="day-of-week"><td><h2>'+key+'</h2></td></tr>'
                );
                
                $jq.each(val, function (key, schedule_item) {
                    var page_link = "";
                    var preview_image = "https://subsplease.org" + schedule_item.image_url;
                    if(schedule_item.page) {
                        page_link = "/shows/" + schedule_item.page;
                    }
                    $jq('#full-schedule-table').append(
                        '<tr class="all-schedule-item"><td class="all-schedule-show"><a title="Go to show" href="' + page_link + '" data-preview-image="' + preview_image + '">' + schedule_item.title + '</a></td><td class="all-schedule-time">' + schedule_item.time + '</td></tr>'
                    );
                });
            });            
        });
    }
    //All shows page, RSS page
    if($jq('.all-shows').length || $jq('#post-201').length) {
        $jq.getJSON('/api/?f=schedule&h=true&tz=' + timezone, function(data) {
            load_schedule(data);
        });
    }
});

