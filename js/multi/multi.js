(function() {
    var peer = new Peer();
    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });


    const serverId = 'mat3d-server-peer-id';
    function serve() {
        peer.on('connection', function(conn) {
            // Receive messages
            conn.on('data', function(data) {
                console.log('Received', data);
            });

            // Send messages
            conn.send('Hello!');
        });
    }
    function client() {
        var conn = peer.connect(serverId);
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
    }
    if (!window.multi) window.multi = {};
    window.multi.client = client;
    window.multi.serve = serve;
})();
