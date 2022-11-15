/*
        youtube.js                                                                         
        API non ufficiale per ottenere video e audio di contenuti YouTube.

        By 𝓚𝓲𝓷𝓭𝓮𝓻𝓑𝓸𝓪𝓷𝓸
        2022
 */
var abctrl = new AbortController();
var YouTube = {
    API_URL: "https://apiyoutube.cc/",
    getAudioVideoURL: async function (video_id) {
        if (typeof CORS != 'object') {
            console.error("Please include cors.js first.");
            return;
        }
        var c = await CORS.getText(this.API_URL + "check.php?v=" + video_id)
        try {
            var p = JSON.parse(c);
            var hash = p.hash + "::" + p.user;
            var tmp;
            do {
                var t = await CORS.getText(this.API_URL + "progress.php?id=" + hash + "&t=" + Date.now())
                try {
                    var ass_vid = JSON.parse(t);
                    tmp = ass_vid["mp3"];
                    for (var i = 0; i < ass_vid["mp3"].length; i++) {
                        var q = ass_vid["mp3"][i]["aq"];
                        ass_vid["mp3"][i]["url"] = this.API_URL + q + "/" + hash;
                        ass_vid["mp3"][i]["as"] = parseFloat(ass_vid["mp3"][i]["as"].split(" ")[0]) * 1024 * 1024;
                    }
                    for (var i = 0; i < ass_vid["mp4"].length; i++) {
                        var q = ass_vid["mp4"][i]["vq"];
                        ass_vid["mp4"][i]["url"] = this.API_URL + q + "/" + hash;
                        ass_vid["mp4"][i]["vs"] = parseFloat(ass_vid["mp4"][i]["vs"].split(" ")[0]) * 1024 * 1024;
                    }
                    return ass_vid;
                } catch (e) {
                }
            } while (tmp == null);
        } catch (e) {

        }
    },
    getYTmp3_old: async function (id, service = "") {
        return await (await fetch("/api/ytmp3.php?id=" + id, { signal: abctrl.signal })).text();
    },
    getYTmp3: async function (id, svc, tag = 140) {
        if (this.URLS_ARCHIVE[id + "-" + tag]) {
            if (isExpired(this.URLS_ARCHIVE[id + "-" + tag]))
                delete this.URLS_ARCHIVE[id + "-" + tag];
            else
                return this.URLS_ARCHIVE[id + "-" + tag];
        } 
        var r = await (await fetch("/api/ytlinks.php?itag=" + tag + "&id=" + id, { signal: abctrl.signal })).json();
        this.URLS_ARCHIVE[id + "-" + tag] = r.url;
        localStorage.setItem("urlsarch", JSON.stringify(this.URLS_ARCHIVE));
        return r.url;
    },
    URLS_ARCHIVE: {}
}