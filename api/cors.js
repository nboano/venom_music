/*
        cors.js                                                                         
        Libreria che permette di interfacciare JavaScript client-side con cors-anywhere,

        By 𝓚𝓲𝓷𝓭𝓮𝓻𝓑𝓸𝓪𝓷𝓸
        2022
 */

var CORS = {
    API_URL: null,
    init: function (api_url) {
        this.API_URL = api_url;
    },
    fetch: async function (url, options = {}) {
        url = encodeURIComponent(url);

        if (this.API_URL == null) {
            console.error("Use the CORS.init() method to specify the proxy instance URL.");
            return null;
        }

        //url = url.replace("http://", "");
        //url = url.replace("https://", "");

        return await fetch(this.API_URL + url, options);
    },
    getText: async function (url, options = {}) {
        var r = await this.fetch(url, options);
        if (r == null) return;
        return await r.text();
    },
    getArrayBuffer: function (url, updatefn = function (e) { }) {
        url = encodeURIComponent(url);
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.open("GET", CORS.API_URL + url);
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = () => {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.onprogress = updatefn;
            xhr.send();
        });
    },
    getBlob: function (url, updatefn = function (e) { }) {
        url = encodeURIComponent(url);
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open("GET", CORS.API_URL + url);
            xhr.setRequestHeader("range", "bytes=0-");
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = () => {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.onprogress = updatefn;
            xhr.send();
        });
    },
    getDataURL: async function (url, updatefn = function (e) { }) {
        return new Promise(function (resolve, reject) {
            CORS.getBlob(url, updatefn).then(blob => {
                var a = new FileReader();
                a.onload = function (e) { resolve(e.target.result); };
                a.onerror = reject;
                a.readAsDataURL(blob);
            });
        });
    }
}
/* 
            Cronologia:
            20220726 Creazione della libreria
 */