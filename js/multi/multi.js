(function() {
    const serverId = 'mat3d-server-peer-id';


    function serve() {
        console.log('starting server');

        var peer = new Peer(serverId);
        peer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
        });

        peer.on('connection', function(conn) {
            console.log('someone connected!', conn);
            conn.on('data', function(data){
              // Will print 'hi!'
              console.log('received ', data);
              conn.send('hello from server');
            });
            window.multi.send = conn.send;

          });

    }
    function client() {
        console.log('connecting');
        var peer = new Peer();
        peer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
        });
        var conn = peer.connect(serverId);
        if (conn === undefined) throw new Error('connection failed for some reason');
        // on open will be launch when you successfully connect to PeerServer
        conn.on('open', function(){
            // here you have conn.id
            console.log('connection opened');
            conn.send('hi!');
            window.multi.send = conn.send;
        });
        conn.on('error', err => console.error(err));
        conn.on('data', (a,b,c) => console.log('data', {a,b,c}));
        conn.on('close', (a,b,c) => console.log('close', {a,b,c}));
        conn.on('disconnected', (a,b,c) => console.log('disconnect', {a,b,c}));
    }
    if (!window.multi) window.multi = {};
    window.multi.client = client;
    window.multi.serve = serve;
})();
