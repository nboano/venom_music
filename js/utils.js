//#region ID3 TAG WRITER
!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).ID3Writer = t() }(this, function () { "use strict"; function a(e) { return String(e).split("").map(function (e) { return e.charCodeAt(0) }) } function o(e) { return new Uint8Array(a(e)) } function u(e) { var t = new Uint8Array(2 * e.length); return new Uint16Array(t.buffer).set(a(e)), t } return function () { var e = t.prototype; function t(e) { if (!(e && "object" == typeof e && "byteLength" in e)) throw new Error("First argument should be an instance of ArrayBuffer or Buffer"); this.arrayBuffer = e, this.padding = 4096, this.frames = [], this.url = "" } return e._setIntegerFrame = function (e, t) { var a = parseInt(t, 10); this.frames.push({ name: e, value: a, size: 11 + a.toString().length }) }, e._setStringFrame = function (e, t) { var a = t.toString(); this.frames.push({ name: e, value: a, size: 13 + 2 * a.length }) }, e._setPictureFrame = function (e, t, a, r) { var n, s, i, c = function (e) { if (!e || !e.length) return null; if (255 === e[0] && 216 === e[1] && 255 === e[2]) return "image/jpeg"; if (137 === e[0] && 80 === e[1] && 78 === e[2] && 71 === e[3]) return "image/png"; if (71 === e[0] && 73 === e[1] && 70 === e[2]) return "image/gif"; if (87 === e[8] && 69 === e[9] && 66 === e[10] && 80 === e[11]) return "image/webp"; var t = 73 === e[0] && 73 === e[1] && 42 === e[2] && 0 === e[3], a = 77 === e[0] && 77 === e[1] && 0 === e[2] && 42 === e[3]; return t || a ? "image/tiff" : 66 === e[0] && 77 === e[1] ? "image/bmp" : 0 === e[0] && 0 === e[1] && 1 === e[2] && 0 === e[3] ? "image/x-icon" : null }(new Uint8Array(t)), o = a.toString(); if (!c) throw new Error("Unknown picture MIME type"); a || (r = !1), this.frames.push({ name: "APIC", value: t, pictureType: e, mimeType: c, useUnicodeEncoding: r, description: o, size: (n = t.byteLength, s = c.length, i = o.length, 11 + s + 1 + 1 + (r ? 2 + 2 * (i + 1) : i + 1) + n) }) }, e._setLyricsFrame = function (e, t, a) { var r, n, s = e.split("").map(function (e) { return e.charCodeAt(0) }), i = t.toString(), c = a.toString(); this.frames.push({ name: "USLT", value: c, language: s, description: i, size: (r = i.length, n = c.length, 16 + 2 * r + 2 + 2 + 2 * n) }) }, e._setCommentFrame = function (e, t, a) { var r, n, s = e.split("").map(function (e) { return e.charCodeAt(0) }), i = t.toString(), c = a.toString(); this.frames.push({ name: "COMM", value: c, language: s, description: i, size: (r = i.length, n = c.length, 16 + 2 * r + 2 + 2 + 2 * n) }) }, e._setPrivateFrame = function (e, t) { var a, r, n = e.toString(); this.frames.push({ name: "PRIV", value: t, id: n, size: (a = n.length, r = t.byteLength, 10 + a + 1 + r) }) }, e._setUserStringFrame = function (e, t) { var a, r, n = e.toString(), s = t.toString(); this.frames.push({ name: "TXXX", description: n, value: s, size: (a = n.length, r = s.length, 13 + 2 * a + 2 + 2 + 2 * r) }) }, e._setUrlLinkFrame = function (e, t) { var a = t.toString(); this.frames.push({ name: e, value: a, size: 10 + a.length }) }, e.setFrame = function (e, t) { switch (e) { case "TPE1": case "TCOM": case "TCON": if (!Array.isArray(t)) throw new Error(e + " frame value should be an array of strings"); var a = "TCON" === e ? ";" : "/", r = t.join(a); this._setStringFrame(e, r); break; case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TMED": case "TPUB": case "TCOP": case "TKEY": case "TEXT": case "TSRC": this._setStringFrame(e, t); break; case "TBPM": case "TLEN": case "TDAT": case "TYER": this._setIntegerFrame(e, t); break; case "USLT": if (t.language = t.language || "eng", !("object" == typeof t && "description" in t && "lyrics" in t)) throw new Error("USLT frame value should be an object with keys description and lyrics"); if (t.language && !t.language.match(/[a-z]{3}/i)) throw new Error("Language must be coded following the ISO 639-2 standards"); this._setLyricsFrame(t.language, t.description, t.lyrics); break; case "APIC": if (!("object" == typeof t && "type" in t && "data" in t && "description" in t)) throw new Error("APIC frame value should be an object with keys type, data and description"); if (t.type < 0 || 20 < t.type) throw new Error("Incorrect APIC frame picture type"); this._setPictureFrame(t.type, t.data, t.description, !!t.useUnicodeEncoding); break; case "TXXX": if (!("object" == typeof t && "description" in t && "value" in t)) throw new Error("TXXX frame value should be an object with keys description and value"); this._setUserStringFrame(t.description, t.value); break; case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB": this._setUrlLinkFrame(e, t); break; case "COMM": if (t.language = t.language || "eng", !("object" == typeof t && "description" in t && "text" in t)) throw new Error("COMM frame value should be an object with keys description and text"); if (t.language && !t.language.match(/[a-z]{3}/i)) throw new Error("Language must be coded following the ISO 639-2 standards"); this._setCommentFrame(t.language, t.description, t.text); break; case "PRIV": if (!("object" == typeof t && "id" in t && "data" in t)) throw new Error("PRIV frame value should be an object with keys id and data"); this._setPrivateFrame(t.id, t.data); break; default: throw new Error("Unsupported frame " + e) }return this }, e.removeTag = function () { if (!(this.arrayBuffer.byteLength < 10)) { var e, t, a = new Uint8Array(this.arrayBuffer), r = a[3], n = ((e = [a[6], a[7], a[8], a[9]])[0] << 21) + (e[1] << 14) + (e[2] << 7) + e[3] + 10; if (!(73 !== (t = a)[0] || 68 !== t[1] || 51 !== t[2] || r < 2 || 4 < r)) this.arrayBuffer = new Uint8Array(a.subarray(n)).buffer } }, e.addTag = function () { this.removeTag(); var e, t, r = [255, 254], a = 10 + this.frames.reduce(function (e, t) { return e + t.size }, 0) + this.padding, n = new ArrayBuffer(this.arrayBuffer.byteLength + a), s = new Uint8Array(n), i = 0, c = []; return c = [73, 68, 51, 3], s.set(c, i), i += c.length, i++, i++, c = [(e = a - 10) >>> 21 & (t = 127), e >>> 14 & t, e >>> 7 & t, e & t], s.set(c, i), i += c.length, this.frames.forEach(function (e) { var t, a; switch (c = o(e.name), s.set(c, i), i += c.length, t = e.size - 10, c = [t >>> 24 & (a = 255), t >>> 16 & a, t >>> 8 & a, t & a], s.set(c, i), i += c.length, i += 2, e.name) { case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB": c = o(e.value), s.set(c, i), i += c.length; break; case "TPE1": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSRC": c = [1].concat(r), s.set(c, i), i += c.length, c = u(e.value), s.set(c, i), i += c.length; break; case "TXXX": case "USLT": case "COMM": c = [1], "USLT" !== e.name && "COMM" !== e.name || (c = c.concat(e.language)), c = c.concat(r), s.set(c, i), i += c.length, c = u(e.description), s.set(c, i), i += c.length, c = [0, 0].concat(r), s.set(c, i), i += c.length, c = u(e.value), s.set(c, i), i += c.length; break; case "TBPM": case "TLEN": case "TDAT": case "TYER": i++, c = o(e.value), s.set(c, i), i += c.length; break; case "PRIV": c = o(e.id), s.set(c, i), i += c.length, i++, s.set(new Uint8Array(e.value), i), i += e.value.byteLength; break; case "APIC": c = [e.useUnicodeEncoding ? 1 : 0], s.set(c, i), i += c.length, c = o(e.mimeType), s.set(c, i), i += c.length, c = [0, e.pictureType], s.set(c, i), i += c.length, e.useUnicodeEncoding ? (c = [].concat(r), s.set(c, i), i += c.length, c = u(e.description), s.set(c, i), i += c.length, i += 2) : (c = o(e.description), s.set(c, i), i += c.length, i++), s.set(new Uint8Array(e.value), i), i += e.value.byteLength } }), i += this.padding, s.set(new Uint8Array(this.arrayBuffer), i), this.arrayBuffer = n }, e.getBlob = function () { return new Blob([this.arrayBuffer], { type: "audio/mpeg" }) }, e.getURL = function () { return this.url || (this.url = URL.createObjectURL(this.getBlob())), this.url }, e.revokeURL = function () { URL.revokeObjectURL(this.url) }, t }() });
//#endregion
//#region FILESAVER
/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
    ? window : typeof self === 'object' && self.self === self
        ? self : typeof global === 'object' && global.global === global
            ? global
            : this

function bom(blob, opts) {
    if (typeof opts === 'undefined') opts = { autoBom: false }
    else if (typeof opts !== 'object') {
        console.warn('Deprecated: Expected third argument to be a object')
        opts = { autoBom: !opts }
    }

    // prepend BOM for UTF-8 XML and text/* types (including HTML)
    // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
    if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
    }
    return blob
}

function download(url, name, opts) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onload = function () {
        saveAs(xhr.response, name, opts)
    }
    xhr.onerror = function () {
        console.error('could not download file')
    }
    xhr.send()
}

function corsEnabled(url) {
    var xhr = new XMLHttpRequest()
    // use sync to avoid popup blocker
    xhr.open('HEAD', url, false)
    try {
        xhr.send()
    } catch (e) { }
    return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click(node) {
    try {
        node.dispatchEvent(new MouseEvent('click'))
    } catch (e) {
        var evt = document.createEvent('MouseEvents')
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
            20, false, false, false, false, 0, null)
        node.dispatchEvent(evt)
    }
}

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
    // probably in some web worker
    (typeof window !== 'object' || window !== _global)
        ? function saveAs() { /* noop */ }

        // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
        : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
            ? function saveAs(blob, name, opts) {
                var URL = _global.URL || _global.webkitURL
                // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue #561)
                var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
                name = name || blob.name || 'download'

                a.download = name
                a.rel = 'noopener' // tabnabbing

                // TODO: detect chrome extensions & packaged apps
                // a.target = '_blank'

                if (typeof blob === 'string') {
                    // Support regular links
                    a.href = blob
                    if (a.origin !== location.origin) {
                        corsEnabled(a.href)
                            ? download(blob, name, opts)
                            : click(a, a.target = '_blank')
                    } else {
                        click(a)
                    }
                } else {
                    // Support blobs
                    a.href = URL.createObjectURL(blob)
                    setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
                    setTimeout(function () { click(a) }, 0)
                }
            }

            // Use msSaveOrOpenBlob as a second approach
            : 'msSaveOrOpenBlob' in navigator
                ? function saveAs(blob, name, opts) {
                    name = name || blob.name || 'download'

                    if (typeof blob === 'string') {
                        if (corsEnabled(blob)) {
                            download(blob, name, opts)
                        } else {
                            var a = document.createElement('a')
                            a.href = blob
                            a.target = '_blank'
                            setTimeout(function () { click(a) })
                        }
                    } else {
                        navigator.msSaveOrOpenBlob(bom(blob, opts), name)
                    }
                }

                // Fallback to using FileReader and a popup
                : function saveAs(blob, name, opts, popup) {
                    // Open a popup immediately do go around popup blocker
                    // Mostly only available on user interaction and the fileReader is async so...
                    popup = popup || open('', '_blank')
                    if (popup) {
                        popup.document.title =
                            popup.document.body.innerText = 'downloading...'
                    }

                    if (typeof blob === 'string') return download(blob, name, opts)

                    var force = blob.type === 'application/octet-stream'
                    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
                    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

                    if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
                        // Safari doesn't allow downloading of blob URLs
                        var reader = new FileReader()
                        reader.onloadend = function () {
                            var url = reader.result
                            url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
                            if (popup) popup.location.href = url
                            else location = url
                            popup = null // reverse-tabnabbing #460
                        }
                        reader.readAsDataURL(blob)
                    } else {
                        var URL = _global.URL || _global.webkitURL
                        var url = URL.createObjectURL(blob)
                        if (popup) popup.location = url
                        else location.href = url
                        popup = null // reverse-tabnabbing #460
                        setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
                    }
                }
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
    module.exports = saveAs;
}
//#endregion
//#region SALVATAGGIO BINARIO
const hopefully_unique_id = "_venom_";
function generateBinary(JSObject) {
    let blobIndex = 0;
    const blobsMap = new Map();
    const JSONString = JSON.stringify(JSObject, (key, value) => {
        if (value instanceof Blob) {
            if (blobsMap.has(value)) {
                return blobsMap.get(value);
            }
            blobsMap.set(value, hopefully_unique_id + (blobIndex++));
            return hopefully_unique_id + blobIndex;
        }
        return value;
    });
    const blobsArr = [...blobsMap.keys()];
    const data = [
        new Uint32Array([blobsArr.length]),
        ...blobsArr.map((blob) => new Uint32Array([blob.size])),
        ...blobsArr,
        JSONString
    ];
    return new Blob(data);
}

async function readBinary(bin) {
    const numberOfBlobs = new Uint32Array(await bin.slice(0, 4).arrayBuffer())[0];
    let cursor = 4 * (numberOfBlobs + 1);
    const blobSizes = new Uint32Array(await bin.slice(4, cursor).arrayBuffer())
    const blobs = [];
    for (let i = 0; i < numberOfBlobs; i++) {
        const blobSize = blobSizes[i];
        blobs.push(bin.slice(cursor, cursor += blobSize));
    }
    const pattern = new RegExp(`^${hopefully_unique_id}\\d+$`);
    const JSObject = JSON.parse(
        await bin.slice(cursor).text(),
        (key, value) => {
            if (typeof value !== "string" || !pattern.test(value)) {
                return value;
            }
            const index = +value.replace(hopefully_unique_id, "") - 1;
            return blobs[index];
        }
    );
    return JSObject;
}
//#endregion
window.onerror = function (msg, url, linenumber) {
    alert('An error occured!\n\n' + msg + '\nURL: ' + url + '\nLine: ' + linenumber);
    return true;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function get_average_rgb(src) {
    if (src.indexOf("ytimg") != -1) src = CORS.API_URL + src;
    return new Promise(resolve => {
        try {
            var imageObject = new Image();
            imageObject.src = src;
            imageObject.setAttribute("crossorigin", "");
            const context = document.createElement("canvas").getContext("2d");
            imageObject.onload = () => {
                context.drawImage(imageObject, 0, 0, 1, 1);
                resolve(context.getImageData(0, 0, 1, 1).data);
            }
        } catch (e) {
            resolve([12, 12, 12]);
        }
    })
}
function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;
};

function resizeCoverImg(url, w, h, pw = 60, ph = 60) {
    return url.replace(`=w${pw}-h${ph}`, `=w${w}-h${h}`);
}
function isExpired(url) {
    return Date.now() >= new Date(Number(url.split("?expire=")[1].split("&ei=")[0]) * 1000);
}

function cacheclear() {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
    }
    caches.delete("VENOM_SW");
    location.reload();
}
function preloadAudioURLs(sr, coll) {
    if (abctrl) abctrl.abort();
    abctrl = new AbortController();
    Player.List = [];
    if (coll.length == 0) {
        StatusBar.clear();
        return;
    }
    async function ga(el, id, last = false, sr, i) {
        var url = await YouTube.getYTmp3(id, Settings.current.STREAM_SVC || "9convert");
        if (last) StatusBar.clear();
        return [el, url, sr, i];
    }
    StatusBar.write(lang.current.PROCESSING, StatusBar.Info);
    sr = sr.filter(el => el.type == "song" || el.type == "video");
    for (var i = 0; i < sr.length; i++) {
        var ind = saved.find(sr[i].videoId);
        if (!(sr[i].cachedURL instanceof Blob) && ind != -1) {
            sr[i].cachedURL = saved.r[ind].cachedURL;
        }
        if (!(sr[i].cachedURL instanceof Blob)) {
            ga(coll[i], sr[i].videoId, i == sr.length - 1, sr[i], i).then(r => {
                const [el, url, sr, i] = r;
                if (url) {
                    Player.List[i] = { sr: sr, url: url, el: el };
                    el.querySelector(":nth-child(2)").onclick = function (e) {
                        var sender = e.target;
                        while (sender && sender.nodeName.toLowerCase() != "div")
                            sender = sender.parentNode;
                        Player.PlayFromURL(url, {
                            name: sr.name,
                            id: sr.videoId,
                            artist: (sr.type == "song") ? sr.artist.join(", ") : sr.author,
                            thumbnail: (sr.type == "song") ? sr.thumbnails[0].url : sr.thumbnails.url,
                            index: i,
                        }, sender);
                        likeupd(sr.videoId, sr);
                    }
                    //if (sr.type == "song")
                    //    el.querySelector(":nth-child(2)").setAttribute("onclick", `Player.PlayFromURL("${url}", { name: "${sr.name.replace(/'/g, "&#39;")}", id: "${sr.videoId}", artist: "${sr.artist.join(", ")}", thumbnail: "${sr.thumbnails[0].url}", index: ${i} }, this);likeupd("${sr.videoId}", ${JSON.stringify(sr)});`);
                    //else if (sr.type == "video")
                    //    el.querySelector(":nth-child(2)").setAttribute("onclick", `Player.PlayFromURL("${url}", { name: "${sr.name.replace(/'/g, "&#39;")}", id: "${sr.videoId}", artist: "${sr.author}", thumbnail: "${sr.thumbnails.url}", index: ${i} }, this);likeupd("${sr.videoId}", ${JSON.stringify(sr)});`);
                    el.classList.remove("disabled");
                } else el.style.color = "red";
            })
        } else {
            var ou = URL.createObjectURL(sr[i].cachedURL);
            Player.List[i] = { sr: sr[i], url: ou, el: coll[i] };
            coll[i].querySelector(":nth-child(2)").setAttribute("onclick", `Player.PlayFromURL('${ou}', { name: "${sr[i].name.replace(/'/g, "&#39;")}", id: "${sr[i].videoId}", artist: "${sr[i].artist.join(", ")}", thumbnail: "${sr[i].thumbnails[0].url}", index: ${i} }, this);likeupd("${sr[i].videoId}", ${JSON.stringify(sr[i])});`);
            coll[i].classList.remove("disabled");
            var e = coll[i].querySelector(".is-dl");
            if (e) {
                e.innerHTML = `<img src='assets/images/dlicon.png' style='height: 16px; vertical-align:middle;'/>&nbsp;&nbsp;`;
            }
        }
    }
}
function clearAllPlaying() {
    for (var el of document.querySelectorAll(".song-cont.playing, .song-cont .playing")) {
        el.classList.remove("playing");
    }
}
function ls_export() {
    saveAs(new Blob([JSON.stringify(localStorage)]), "export_" + Date.now() + ".vnexp");
}
const StatusBar = {
    Error: "red",
    Warning: "yellow",
    Success: "green",
    Info: "#007bff",
    write: function (text, color) {
        document.getElementById("status-bar").style.backgroundColor = color;
        document.getElementById("status-bar").innerHTML = text;
        document.getElementById("mini_player").style.bottom = "82px";
    },
    clear: function () {
        document.getElementById("status-bar").style.backgroundColor = "transparent";
        document.getElementById("status-bar").innerHTML = "";
        document.getElementById("mini_player").style.bottom = "64px";
    }
}
const Settings = {
    default: {
        CAW_URL: "/proxy.php?url=",
        LANG: navigator.language.split("-")[0],
        QUALITY: 192,
        STREAM_SVC: "MBSRV",
    },
    current: {},
    get: function () {
        return JSON.parse(localStorage.getItem("settings"));
    },
    load: function () {
        document.getElementById("cmb_language").value = Settings.current.LANG;
        document.getElementById("cmb_quality").value = Settings.current.QUALITY;
        lang.current = lang[Settings.current.LANG];
    },
    save: function () {
        Settings.current.LANG = document.getElementById("cmb_language").value;
        Settings.current.QUALITY = document.getElementById("cmb_quality").value;
        localStorage.setItem("settings", JSON.stringify(Settings.current));
    },
    reset: function () {
        Settings.current = Settings.default;
        localStorage.setItem("settings", JSON.stringify(Settings.current));
    }
}
if (localStorage.getItem("settings") == null) {
    Settings.current = Settings.default;
} else Settings.current = Settings.get();
lang.current = lang[Settings.current.LANG];
window.addEventListener("load", Settings.load);

const recents = {
    add: function (q) {
        q = q.toLowerCase();
        var rc = recents.get() || [];
        if (rc.indexOf(q) == -1) {
            rc.push(q);
        }
        recents.set(rc);
        recents.write(rc);
    },
    get: function () {
        return JSON.parse(localStorage.getItem("recent-searches"));
    },
    set: function (rc) {
        localStorage.setItem("recent-searches", JSON.stringify(rc));
    },
    clear: function () {
        recents.set([]);
        recents.write([]);
    },
    write: function (rc) {
        if (rc != null) {
            var cont = document.getElementById("search_recents");
            cont.innerHTML = "";
            for (var e of rc) {
                cont.innerHTML += `
                    <div class='search-recent'>
                        &#128337; <a href='javascript:search("${e}")'>${e}</a>
                    </div>
                `;
            }
        }
    },
    writegt: function () {
        recents.write(recents.get());
    }
}
window.addEventListener("load", recents.writegt);


const liked = {
    r: [],
    display: function () {
        scriviLstCanzoni(liked.r, document.getElementById("liked_songs"))
    },
    add: function (e) {
        liked.r.push(e);
        liked.display();
        localStorage.setItem("liked", JSON.stringify(liked.r));
    },
    remove: function (e) {
        liked.r.splice(liked.find(e.videoId), 1);
        liked.display();
        localStorage.setItem("liked", JSON.stringify(liked.r));
    },
    find: function (video_id) {
        return liked.r.findIndex(el => el.videoId == video_id);
    },
    has: function (video_id) {
        return liked.find(video_id) != -1;
    }
}

const saved = {
    r: [],
    display: function () {
        scriviLstCanzoni(saved.r, document.getElementById("saved_songs"))
    },
    add: function (e) {
        saved.r.push(e);
        saved.display();
        localforage.setItem("saved", saved.r);
    },
    remove: function (e) {
        saved.r.splice(saved.find(e.videoId), 1);
        saved.display();
        localforage.setItem("saved", saved.r);
    },
    find: function (video_id) {
        return saved.r.findIndex(el => el.videoId == video_id);
    },
    has: function (video_id) {
        return saved.find(video_id) != -1;
    }
}

window.addEventListener("load", async function () {
    if (localStorage.getItem("liked"))
        liked.r = JSON.parse(localStorage.getItem("liked"));
    else
        localStorage.setItem("liked", "[]");
    //liked.display();

    if (localStorage.getItem("urlsarch"))
        YouTube.URLS_ARCHIVE = JSON.parse(localStorage.getItem("urlsarch"));
    else
        localStorage.setItem("urlsarch", "{}");

    if (await localforage.getItem("saved") != null) {
        saved.r = await localforage.getItem("saved");
    }
    else
        await localforage.setItem("saved", []);
    //saved.display();

    for (let k of Object.keys(YouTube.URLS_ARCHIVE)) {
        if (isExpired(YouTube.URLS_ARCHIVE[k])) {
            delete YouTube.URLS_ARCHIVE[k];
            localStorage.setItem("urlsarch", JSON.stringify(YouTube.URLS_ARCHIVE));
        }
    }
})