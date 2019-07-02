module.exports = {
    // to some stuff, then connects
    ready: client => {
        client.connect("SNK b3n");
        client.on('game_found', game => {
            game.accept();
        });
        client.on('error', err => {
            client.log('error ' + err);
        });
        client.on('before_game_load', game => {
            client.log('game loading');
        });
        client.on('after_game_load', game => {
            client.log('game ready');
        });
    },
    load: game => {

    }
};
