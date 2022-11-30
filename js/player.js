const Player = {
    IsPlaying: function () {
        return !Player.Track.audioEl.paused;
    },
    Track: {
        id: null,
        thumbnail: null,
        name: null,
        artist: null,
        album_name: null,
        album_year: NaN,
        lyrics: "",
        index: 0,
        audioEl: new Audio(),
    },
    List: [],
    Random: function () {
        shuffle(Player.List);
        Player.PlayFromIndex(0);
    },
    Play: function () {
        Player.Track.audioEl.play();

        document.querySelector("#mini_player .btnPlayPause").innerHTML = icons.PAUSE;
        document.querySelector("#mini_player .btnPlayPause").onclick = Player.Pause;
        document.querySelector("#player .btnPlayPause").innerHTML = icons.PAUSE;
        document.querySelector("#player .btnPlayPause").onclick = Player.Pause;
    },
    Pause: function () {
        Player.Track.audioEl.pause();

        document.querySelector("#mini_player .btnPlayPause").innerHTML = icons.PLAY;
        document.querySelector("#mini_player .btnPlayPause").onclick = Player.Play;
        document.querySelector("#player .btnPlayPause").innerHTML = icons.PLAY;
        document.querySelector("#player .btnPlayPause").onclick = Player.Play;
    },
    PrevTrack: () => Player.PlayFromIndex(Player.Track.index - 1),
    NextTrack: () => Player.PlayFromIndex(Player.Track.index + 1),
    SeekTo: (d) => Player.Track.audioEl.currentTime = d.seekTime,
    PlayFromURL: function (url, opts = {}, sender = null) {
        if (Player.IsPlaying()) {
            Player.Pause();
            Player.Track.audioEl.remove();
        }
        Player.Track = opts;
        Player.Track.audioEl = new Audio();

        const source = document.createElement('source');
        source.setAttribute('src', url);
        source.setAttribute('type', 'audio/mp3');
        Player.Track.audioEl.append(source);
        Player.Track.audioEl.onended = Player.NextTrack;
        //#region IMPOSTO MINIPLAYER
        document.querySelector("#mini_player img").src = opts.thumbnail;
        document.querySelector("#player img").src = resizeCoverImg(opts.thumbnail, 512, 512);
        document.querySelector("#mini_player .track").innerHTML = truncate(opts.name, 20);
        document.querySelector("#mini_player .artist").innerHTML = truncate(opts.artist, 25);
        Player.Track.audioEl.ontimeupdate = function () {
            try {
                document.querySelector("#player progress").max = Math.round(Player.Track.audioEl.duration);
                document.querySelector("#player progress").value = Player.Track.audioEl.currentTime;
                document.querySelector("#player .trascorsi").innerHTML = new Date(1e3 * Player.Track.audioEl.currentTime).toISOString().substr(14, 5);
                document.querySelector("#player .rimanenti").innerHTML = "-" + new Date(1e3 * (Player.Track.audioEl.duration - Player.Track.audioEl.currentTime)).toISOString().substr(14, 5);
            } catch (e) {

            }
        }
        document.querySelector("#player .track").innerHTML = truncate(opts.name, 15);
        document.querySelector("#player .artist").innerHTML = truncate(opts.artist, 20);
        document.querySelector("#player").style.backgroundImage = `url(${resizeCoverImg(opts.thumbnail, 512, 512)})`;
        document.querySelector("#player .lyrics-cont").style.backgroundImage = `url(${resizeCoverImg(opts.thumbnail, 512, 512)})`;
        get_average_rgb(opts.thumbnail).then(r => {
            var [r, g, b] = r;
            document.querySelector("#mini_player").style.backgroundColor = `rgba(${r},${g},${b},0.6)`;
            //document.querySelector("#player").style.backgroundImage = `linear-gradient(rgb(${r},${g},${b}), transparent)`;
            //document.querySelector("#player .lyrics").parentElement.style.backgroundColor = `rgb(${r},${g},${b})`;
            //document.querySelector("#player .lyrics").parentElement.style.color = `rgb(${255-r},${255-g},${200-b})`;
            document.querySelector("#mini_player").style.display = "flex";
        }).catch(e => document.querySelector("#mini_player").style.display = "flex");
        //#endregion
        //StatusBar.write(lang.current.LOADING_AUDIO, StatusBar.Info);
        //Player.Track.audioEl.oncanplaythrough = function () {
        //    StatusBar.clear();
        Player.SetMetadata();
        Player.Play();
        clearAllPlaying();
        if (sender) sender.classList.add("playing");
        //}
        if (Player.Track.id) {
            YTMusic.getSongDetails(Player.Track.id).then(dt => {
                Player.Track.album_name = dt.album.name;
                Player.Track.album_year = dt.album.year;
                Player.SetMetadata();
                YTMusic.getLyrics(dt.lyrics_id).then(ly => {
                    Player.Track.lyrics = ly;
                    document.querySelector("#player .lyrics").innerText = ly;
                })
            });
        }

        setTimeout(function () {
            if (Player.List[Player.Track.index + 1]) {
                var pa = new Audio(Player.List[Player.Track.index + 1].url);
                pa.load();
            }
        }, 2000);
    },
    PlayFromIndex: function (i) {
        Player.List[Player.Track.index].el.classList.remove("playing");
        while (!Player.List[i]) {
            i++;
            if (i >= Player.List.length) i = 0;
        }
        if (Player.List[i]) {
            var sr = Player.List[i].sr;
            Player.PlayFromURL(Player.List[i].url, {
                //id: sr.videoId,
                //artist: sr.artist.join(", "),
                //name: sr.name.replace(/'/g, "&#39;"),
                //thumbnail: sr.thumbnails[0].url,
                //index: i,
                name: sr.name,
                id: sr.videoId,
                artist: (sr.type == "song") ? sr.artist.join(", ") : sr.author,
                thumbnail: (sr.type == "song") ? sr.thumbnails[0].url : sr.thumbnails.url,
                index: i,
            }, Player.List[i].el);
        }
    },
    SetMetadata: function () {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: Player.Track.name.replace(/&#39;/g, "'"),
                artist: Player.Track.artist,
                album: Player.Track.album_name,
                artwork: [
                    { src: resizeCoverImg(Player.Track.thumbnail, 512, 512), sizes: '512x512', type: 'image/jpeg' },
                    { src: resizeCoverImg(Player.Track.thumbnail, 384, 384), sizes: '384x384', type: 'image/jpeg' },
                    { src: resizeCoverImg(Player.Track.thumbnail, 256, 256), sizes: '256x256', type: 'image/jpeg' },
                    { src: resizeCoverImg(Player.Track.thumbnail, 192, 192), sizes: '192x192', type: 'image/jpeg' },
                    { src: resizeCoverImg(Player.Track.thumbnail, 128, 128), sizes: '128x128', type: 'image/jpeg' },
                    { src: resizeCoverImg(Player.Track.thumbnail, 96, 96), sizes: '96x96', type: 'image/jpeg' },
                ]
            });
            navigator.mediaSession.setActionHandler("play", Player.Play);
            navigator.mediaSession.setActionHandler("pause", Player.Pause);
            navigator.mediaSession.setActionHandler("previoustrack", Player.PrevTrack);
            navigator.mediaSession.setActionHandler("nexttrack", Player.NextTrack);
            navigator.mediaSession.setActionHandler('seekto', Player.SeekTo);
        }
    },
    ClearMetadata: function () {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata();
            navigator.mediaSession.setActionHandler("play", null);
            navigator.mediaSession.setActionHandler("pause", null);
            navigator.mediaSession.setActionHandler("previoustrack", null);
            navigator.mediaSession.setActionHandler("nexttrack", null);
        }
    }
}