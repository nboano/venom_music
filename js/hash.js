window.addEventListener("load", handle_hash_change);
window.addEventListener("hashchange", handle_hash_change);
function handle_hash_change() {
    var urlParams;
    nascondi_tutte_pagine();
    if (location.hash == "#" || location.hash == "")
        document.querySelector("#pages .home").style.display = "block";
    else
        document.querySelector("#pages ." + location.hash.replace("#", "").split("?")[0]).style.display = "block";
    switch (location.hash.split("?")[0]) {
        case "#search":
        case "search":
            urlParams = new URLSearchParams("?" + location.href.split("?")[1]);
            if (urlParams.has("q")) {
                to_do_at_loadend += `search("${urlParams.get("q")}");`;
            }
            break;
        case "#album":
        case "album":
            urlParams = new URLSearchParams("?" + location.href.split("?")[1]);
            if (urlParams.has("id")) {
                to_do_at_loadend += `loadAlbum("${urlParams.get("id")}");`;
            }
            try {
                loadAlbum(urlParams.get("id"));
            } catch (e) {}
            break;
        case "#liked":
        case "liked":
            to_do_at_loadend += `liked.display();`;
            try {
                liked.display();
            } catch (e) {
            }
            break;
        case "#saved":
        case "saved":
            saved.display();
            break;
    }
}
function nascondi_tutte_pagine() {
    var pagine = document.querySelectorAll("#pages > div");
    for (var i = 0; i < pagine.length; i++) {
        pagine[i].style.display = "none";
    }
}