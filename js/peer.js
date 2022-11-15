const PEER_ID = Math.floor((Math.random() * 2e10)).toString(36);
const PEER_PREFIX = "venommusic-";

window.addEventListener("load", function() {
    window.peer = new Peer(PEER_PREFIX + PEER_ID);
    peer.on('open', function() {
        document.getElementById("txtSessionId").innerHTML = PEER_ID;
    });
    peer.on('error', function() {
        document.getElementById("txtSessionId").innerHTML = lang.current.PEER_CONN_ERROR;
    });
    peer.on('connection', function(conn) {
            conn.on('data', function(data){
                var s = data.split("#vnmtr#");
                switch(s[0]){
                    case "p2p_transfer_all":
                        var n = JSON.parse(s[1]);
                        for(var k of Object.keys(n)) {
                            localStorage.setItem(k, n[k]);
                        }
                        location.reload();
                        break;
                }
            });
    });
});
function transfer_all_p2p(){
    var remoteid = PEER_PREFIX + prompt(lang.current.INSERT_SESS_ID_TRANSFER);
    window.conn = peer.connect(remoteid);
    conn.on('open', function() {
        conn.send("p2p_transfer_all#vnmtr#" + JSON.stringify(localStorage));
    });
}