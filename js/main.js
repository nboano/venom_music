const AUDIO_CACHE = "AUDIO_CACHE";

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                '/sw.js?t=' + Date.now(),
                {
                    scope: '/',
                }
            );
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }

}
registerSW();
var to_do_at_loadend = "";
window.addEventListener("load", function () {
    fetch("https://www.ma-srv.tk/website_stats/");
    if (!navigator.onLine) StatusBar.write(lang.current.NO_NETWORK, StatusBar.Warning);
    else {
        StatusBar.write(lang.current.TRYING_CAW_CONN, "#007bff");
            //StatusBar.write(lang.current.CAW_CONN_SUCCESS, StatusBar.Success);
            // CORS OK
            CORS.init("/proxy.php?url=");
            StatusBar.write(lang.current.TRYING_YTMUSIC_CONN, "#007bff");
            YTMusic.init().then(r => {
                StatusBar.write(lang.current.YTMUSIC_CONN_SUCCESS, StatusBar.Success);
                eval(to_do_at_loadend);
                let txts = document.getElementById("txt_search");
                txts.removeAttribute("disabled");
                txts.placeholder = lang.current.SEARCH_BOX_PLACEHOLDER;
                //#region CONTROLLO AGGIORNAMENTI
                fetch("version.txt").then(r => r.text())
                    .then(t => {
                        document.getElementById("txtVersion").innerHTML = t;
                        var currentvers = t;
                        fetch("version.txt?t=" + Date.now()).then(r => r.text())
                            .then(t => {
                                if (currentvers != t) {
                                    StatusBar.write(lang.current.UPDATE_AVAIABLE, StatusBar.Success);
                                    setTimeout(StatusBar.clear, 20000);
                                }
                                else setTimeout(StatusBar.clear, 2000);
                            })
                    });
                //#endregion
            })
                .catch(ex => {
                    StatusBar.write(lang.current.YTMUSIC_CONN_ERROR, StatusBar.Error);
                })
    }
});
function scriviLstCanzoni(sr, e) {
    e.innerHTML = "";
    for (var i = 0; i < sr.length; i++) {
        switch(sr[i].type.toLowerCase()) {
            case "song":
                e.innerHTML += `
                <div class='song-cont search-result disabled'>
                <div style='width: 20%;'>
                    <img src='${sr[i].thumbnails[0].url}' class='tbList'/>
                </div>
                <div style='width: 60%;'>
                    <b>${truncate(sr[i].name, 25)}</b>
                    <br>
                    <small class='is-dl'></small><small>${truncate(sr[i].artist.join(", "), 25)}</small>
                </div>
                <div style='width: 20%; cursor: pointer;' onclick='showSongMenu("${sr[i].name.replace(/'/g, "&#39;")}", "${sr[i].artist.join(", ")}", "${sr[i].videoId}", "${sr[i].playlistId}", "${sr[i].thumbnails[0].url}", ${JSON.stringify(sr[i]).replace(/'/g, "&#39;")})'>
                    <svg height="16" width="16" viewBox="0 0 16 16" style='display: block; fill: #ddd; margin: 0 auto;'>${icons.MENU}</svg>
                </div>
                `;
            break;
            case "album":
            case "singolo":
            case "single":
                e.innerHTML += `
                <div class='album-cont search-result' onclick='location.href = "#album?id=${sr[i].browseId}"'>
                <div style='width: 20%;'>
                    <img src='${sr[i].thumbnails[0].url}' class='tbList'/>
                </div>
                <div style='width: 60%;'>
                    <b>${truncate(sr[i].name, 25)}</b>
                    <br>
                    <small>${sr[i].type[0].toUpperCase() + sr[i].type.substring(1)} - ${truncate(sr[i].artist, 25)}</small>
                </div>
                `;
                break;
            case "artista":
            case "artist":
                e.innerHTML += `
                <div class='artist-cont search-result'>
                <div style='width: 20%;'>
                    <img style='border-radius: 50%; display:block;' src='${sr[i].thumbnails[0].url}'/>
                </div>
                <div style='width: 60%;'>
                    <b>${truncate(sr[i].name, 25)}</b>
                    <br>
                    <small>${lang.current.ARTIST}</small>
                </div>
                `;
                break;
            case "video":
                e.innerHTML += `
                <div class='video-cont search-result disabled'>
                <div style='width: 20%;'>
                    <img style='display: block; width: 60px; height: 60px;' src='${sr[i].thumbnails.url}'/>
                </div>
                <div style='width: 60%;'>
                    <b>${truncate(sr[i].name, 25)}</b>
                    <br>
                    <small>${truncate(sr[i].author, 25)}</small>
                </div>
                <div style='width: 20%; cursor: pointer;' onclick='showSongMenu("${sr[i].name.replace(/'/g, "&#39;")}", "${sr[i].author}", "${sr[i].videoId}", "${sr[i].playlistId}", "${sr[i].thumbnails.url}")'>
                    <svg height="16" width="16" viewBox="0 0 16 16" style='display: block; fill: #ddd; margin: 0 auto;'>${icons.MENU}</svg>
                </div>
                `;
                break;
        }
    }
    e.innerHTML += "<br><br><br>";
    //preloadAudioURLs(sr, document.querySelectorAll(".song-cont.search-result, .video-cont.search-result"));
    preloadAudioURLs(sr, e.querySelectorAll(".song-cont.search-result, .video-cont.search-result"));
}
function loadAlbum(id) {
    StatusBar.write(lang.current.SEARCHING, StatusBar.Info);
    YTMusic.getAlbum(id).then(album => {
        StatusBar.clear();
        document.getElementById("album_img").src = resizeCoverImg(album.thumbnail, 230, 230);
        document.getElementById("album_name").innerHTML = album.title;
        document.getElementById("album_artist").innerHTML = album.artist + " - " + album.year;
        document.getElementById("album_desc").innerHTML = album.description.split(".")[0];
        if (album.tracks) {
            scriviLstCanzoni(album.tracks, document.getElementById("album_song_cont"))
        }
    })
}
function search(q, SEARCH_FILTER = document.getElementById("frmCerca").filtro.value) {
    document.getElementById("cont-search_recents").style.display = "block";
    document.getElementById("cont-search_results").style.display = "none";
    window.history.pushState({}, "/#search", "/#search?q=" + encodeURIComponent(q));
    recents.add(q);
    StatusBar.write(lang.current.SEARCHING, StatusBar.Info);
    YTMusic.search(q, SEARCH_FILTER).then(function (sr) {
        document.getElementById("cont-search_recents").style.display = "none";
        document.getElementById("cont-search_results").style.display = "block";
        scriviLstCanzoni(sr.content, document.getElementById("search_results"));
    });
}
function sm_btnLike_update(id, el) {
    var btn = document.getElementById("songMenu-btnLike");
    if (liked.has(id)) {
        btn.style.color = "#1db954";
        btn.querySelector("svg").style.fill = "#1db954";
        btn.querySelector("svg").innerHTML = icons.LIKE_FULL;
        btn.onclick = function () {
            liked.remove(el);
            likeupd(id, el);
        }
    } else {
        btn.querySelector("svg").style.fill = "#ddd";
        btn.style.color = "#ddd";
        btn.querySelector("svg").innerHTML = icons.LIKE;
        btn.onclick = function () {
            liked.add(el);
            likeupd(id, el);
        }
    }
}
function mp_btnLike_update(id, el) {
    var btn = document.querySelector("#mini_player .btnLike");
    if (liked.has(id)) {
        btn.style.fill = "#1db954";
        btn.innerHTML = icons.LIKE_FULL;
        btn.onclick = function () {
            liked.remove(el);
            likeupd(id, el);
        }
    } else {
        btn.style.fill = "#ddd";
        btn.innerHTML = icons.LIKE;
        btn.onclick = function () {
            liked.add(el);
            likeupd(id, el);
        }
    }
}
function pl_btnLike_update(id, el) {
    var btn = document.querySelector("#player .btnLike");
    if (liked.has(id)) {
        btn.style.fill = "#1db954";
        btn.innerHTML = icons.LIKE_FULL;
        btn.onclick = function () {
            liked.remove(el);
            likeupd(id, el);
        }
    } else {
        btn.style.fill = "#ddd";
        btn.innerHTML = icons.LIKE;
        btn.onclick = function () {
            liked.add(el);
            likeupd(id, el);
        }
    }
}
var lastqueueindex;
function showSongMenu(songname, strart, id, plid, tburl, srel) {
    document.getElementById("songMenu-cover").src = resizeCoverImg(tburl, 180, 180);
    document.getElementById("songMenu-name").innerText = songname;
    document.getElementById("songMenu-artist").innerText = strart;
    document.getElementById("songMenu-btnMp3Dl").setAttribute("onclick", `
        initMp3Dl("${songname}", "${strart}", "${id}", "${plid}", "${tburl}");
    `);
    document.getElementById("songMenu-btnDl").setAttribute("onclick", `
        savesong("${songname}", "${strart}", "${id}", "${plid}", "${tburl}");
    `);
    document.getElementById("songMenu-btnRmDl").setAttribute("onclick", `
        remove_savesong("${songname}", "${strart}", "${id}", "${plid}", "${tburl}");
    `);
    document.getElementById("songMenu-btnQueue").onclick = function () {
    };
    likeupd(id, srel);
    if (saved.has(id)) {
        document.getElementById("songMenu-btnRmDl").style.display = "flex";
        document.getElementById("songMenu-btnDl").style.display = "none";
    } else {
        document.getElementById("songMenu-btnRmDl").style.display = "none";
        document.getElementById("songMenu-btnDl").style.display = "flex";
    }
    document.getElementById("songMenu").showModal();
}
function likeupd(id, el) {
    sm_btnLike_update(id, el);
    mp_btnLike_update(id, el);
    pl_btnLike_update(id, el);
}
// #region GESTIONE DL MP3
async function initMp3Dl(name, strart, id, plid, tburl) {
    tburl = resizeCoverImg(tburl, 640, 640);

    var sb = document.getElementById("mp3Dialog-status");
    var pb = document.getElementById("mp3Dialog-progress");


    function update_pb(e) {
        pb.value = e.loaded;
        pb.max = e.total;
    }
    function update_pb_s(e) {
        pb.value = e.loaded;
    }

    var lyrics;
    var album_name, album_year;

    document.getElementById("songMenu").close();
    document.getElementById("mp3Dialog").showModal();
    sb.innerText = lang.current.RETRIEVING_SONG_INFO;
    var song_det = await YTMusic.getSongDetails(id, plid);

    album_name = song_det.album.name;
    album_year = song_det.album.year;
    if (song_det.lyrics_id) {
        sb.innerText = lang.current.RETRIEVING_SONG_LYRICS;
        lyrics = await YTMusic.getLyrics(song_det.lyrics_id);
    } else {
        lyrics = "";
    }
    sb.innerText = lang.current.RETRIEVING_THUMBNAIL;
    var thumbnail_ab = await CORS.getArrayBuffer(tburl, update_pb);
    sb.innerText = lang.current.RETRIEVING_AUDIOURL;
    var vid_url_arr = await YouTube.getAudioVideoURL(id);
    vid_url_arr.mp3 = vid_url_arr.mp3.filter(e => { return e.aq == Settings.current.QUALITY; });
    pb.max = vid_url_arr.mp3[0].as;
    sb.innerText = lang.current.RETRIEVING_AUDIO;
    var audio_ab = await CORS.getArrayBuffer(vid_url_arr.mp3[0].url, update_pb_s);
    const writer = new ID3Writer(audio_ab);
    // #region TAG MP3
    writer.setFrame('TIT2', name)
        .setFrame('TPE1', [strart])
        .setFrame('APIC', {
            type: 3,
            data: thumbnail_ab,
            description: ""
        }).setFrame('USLT', {
            description: '',
            lyrics: lyrics,
            language: ''
        }).setFrame('TALB', album_name)
        .setFrame('TYER', album_year);
    // #endregion
    writer.addTag();
    document.getElementById("mp3Dialog").close();
    saveAs(writer.getBlob(), `${name} - ${strart} - (${Settings.current.QUALITY}kbps) [venommusic.tk].mp3`);
}
// #endregion
async function savesong(name, strart, id, plid, tburl) {
    document.getElementById("songMenu").close();
    document.getElementById("dlDialog").showModal();
    document.getElementById("dlDialog-status").innerHTML = lang.current.RETRIEVING_SONG_INFO;
    var dt = await YTMusic.getSongDetails(id);
    document.getElementById("dlDialog-status").innerHTML = lang.current.RETRIEVING_AUDIOURL;
    var vid_url = await YouTube.getYTmp3(id, Settings.current.STREAM_SVC);
    document.getElementById("dlDialog-status").innerHTML = lang.current.DOWNLOADING_SONG;
    var pb = document.getElementById("dlDialog-progress");
    var audioblob = await CORS.getBlob(vid_url, function (e) {
        pb.value = e.loaded;
        pb.max = e.total;
    });
    var e = {
        album: dt.album,
        name: name,
        artist: strart.split(", "),
        thumbnails: [
            { url: tburl },
        ],
        type: "song",
        videoId: id,
        cachedURL: audioblob,
    }
    saved.add(e);
    document.getElementById("dlDialog").close();
    alert(name + lang.current.DOWNLOADED);
}
async function remove_savesong(name, strart, id, plid, tburl) {
        saved.remove({ videoId: id });
        document.getElementById("songMenu").close();
        alert(name + lang.current.DELETED);
}